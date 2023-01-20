import { AnyInteractionGateway, CommandInteraction, InteractionTypes, MessageFlags } from 'oceanic.js';
import config from '../../config/config.js';
import { GlobalStatsModel } from '../../database/index.js';
import { logger, constants } from '../../utils/index.js';
import { Main } from '../index.js';

export default async function (interaction: AnyInteractionGateway) {
	if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
		try {
			if (config.IsInDevelopmentMode) {
				logger.debug(`[${new Date().toISOString()}][command/${interaction.data.name}]: ${interaction.user.tag} (${interaction.user.id})`);
			}
			await GlobalStatsModel.findOneAndUpdate(
				{ find_id: 'global' },
				{ $inc: { commands_executed: 1 } },
				{
					upsert: true,
					new: true
				}
			);
			await processCommandInteraction(interaction);
		} catch (error) {
			logger.error(error);
			await interaction
				.createMessage({
					content: `An error occurred while running \`/${interaction.data.name}\` command.`
				})
				.catch(() => {});

			await GlobalStatsModel.findOneAndUpdate(
				{ find_id: 'global' },
				{ $inc: { commands_failed: 1 } },
				{
					new: true,
					upsert: true
				}
			);
		}
	}

	if (interaction.type === InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE) {
		logger.debug(`[${new Date().toISOString()}][autocomplete/${interaction.data.name}]: ${interaction.user.tag} (${interaction.user.id})`);
		switch (interaction.data.name) {
		}
	}
}

/**
 * Handles command interactions
 * @param interaction The interaction to handle
 */
async function processCommandInteraction(interaction: CommandInteraction): Promise<void> {
	if (!interaction.guild) throw new Error('Guild not found');

	const command = Main.collections.commands.commandStoreMap.get(interaction.data.name);

	if (command?.disabled && !Main.collections.keys.super_users.has(interaction.user.id)) {
		return interaction.createMessage({ content: constants.strings.events.interactionProcess.commandDisabled, flags: MessageFlags.EPHEMERAL });
	}

	if (command?.superUserOnly && !Main.collections.keys.super_users.has(interaction.user.id)) {
		return interaction.createMessage({ content: constants.strings.events.interactionProcess.superUsersOnly, flags: MessageFlags.EPHEMERAL });
	}

	if (
		command?.helperUserOnly &&
		!Main.collections.keys.helper_users.has(interaction.user.id) &&
		!Main.collections.keys.super_users.has(interaction.user.id)
	) {
		return interaction.createMessage({ content: constants.strings.events.interactionProcess.helpersOnly, flags: MessageFlags.EPHEMERAL });
	}

	if (command?.requiredBotPermissions) {
		if (!interaction.appPermissions?.has(...command.requiredBotPermissions)) {
			return await interaction.createMessage({
				content: `I need the following permissions: \`${command.requiredBotPermissions}\` to execute this command.`,
				flags: MessageFlags.EPHEMERAL
			});
		}
	}

	if (command?.requiredUserPermissions) {
		if (!interaction.member?.permissions.has(...command.requiredUserPermissions)) {
			return await interaction.createMessage({
				content: `You need the following permissions: \`${command.requiredUserPermissions}\` to execute this command.`,
				flags: MessageFlags.EPHEMERAL
			});
		}
	}

	await (command
		? command.run.call(Main, Main, interaction)
		: interaction.createMessage({ content: "I couldn't figure out how to execute that command.", flags: MessageFlags.EPHEMERAL }));
}
