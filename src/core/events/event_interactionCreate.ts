import { AnyInteractionGateway, CommandInteraction, InteractionTypes, MessageFlags } from 'oceanic.js';
import config from '../../config/config.js';
import { GlobalStatsModel } from '../../database/index.js';
import { logger, constants } from '../../utils/index.js';
import { Main } from '../index.js';
import { DurationFormatter  } from '@sapphire/duration'

const formatter = new DurationFormatter();

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

			if (!config.IsInDevelopmentMode) {
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
	if (!interaction.guild) return;

	const command = Main.collections.commands.commandStoreMap.get(interaction.data.name);

	const isOwner = Main.utils.isOwner(interaction.user.id);

	if (command?.disabled && !isOwner) {
		return await interaction.createMessage({
			embeds: [
				{
					description: Main.utils.stripIndents(
						`
						\`\`\`asciidoc
						• Error :: This command is currently disabled.
						\`\`\`
						`
					),
					color: constants.numbers.colors.primary
				}
			],
			flags: MessageFlags.EPHEMERAL
		});
	}

	if (command?.superUserOnly && !isOwner) {
		return await interaction.createMessage({
			embeds: [
				{
					description: Main.utils.stripIndents(
						`
						\`\`\`asciidoc
						• Error :: This command is only available to the bot owner.
						\`\`\`
						`
					),
					color: constants.numbers.colors.primary
				}
			],
			flags: MessageFlags.EPHEMERAL
		});
	}

	if (command?.helperUserOnly && !isOwner) {
		return await interaction.createMessage({
			embeds: [
				{
					description: Main.utils.stripIndents(
						`
						\`\`\`asciidoc
						• Error :: This command is only available to helper users.
						\`\`\`
						`
					),
					color: constants.numbers.colors.primary
				}
			],
			flags: MessageFlags.EPHEMERAL
		});
	}

	if (command?.requiredBotPermissions) {
		if (!interaction.appPermissions?.has(...command.requiredBotPermissions)) {
			return await interaction.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: Missing Permissions: ${command.requiredBotPermissions}
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				]
			});
		}
	}

	if (command?.requiredUserPermissions) {
		if (!interaction.member?.permissions.has(...command.requiredUserPermissions)) {
			return await interaction.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: Missing Permissions: ${command.requiredUserPermissions}
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				],
				flags: MessageFlags.EPHEMERAL
			});
		}
	}

	if (command?.ratelimit) {
		if (command.ratelimit.global) {
			let manager = command.ratelimit.global;

			let ratelimit = manager.acquire(interaction.guild.id);

			if (ratelimit.limited) {
				return await interaction.createMessage({
					embeds: [
						{
							description: Main.utils.stripIndents(
								`
							\`\`\`asciidoc
							• Error :: This command is currently rate-limited globally. Please try again in ${formatter.format(ratelimit.remainingTime)}
							\`\`\`
							`
							),
							color: constants.numbers.colors.primary
						}
					],
					flags: MessageFlags.EPHEMERAL
				});
			}

			ratelimit.consume();
		}

		if (command.ratelimit.guild) {
			let manager = command.ratelimit.guild;

			let ratelimit = manager.acquire(interaction.guild.id);

			if (ratelimit.limited) {
				return await interaction.createMessage({
					embeds: [
						{
							description: Main.utils.stripIndents(
								`
							\`\`\`asciidoc
							• Error :: This command is currently rate-limited in this guild. Please try again in ${formatter.format(ratelimit.remainingTime)}
							\`\`\`
							`
							),
							color: constants.numbers.colors.primary
						}
					],
					flags: MessageFlags.EPHEMERAL
				});
			}

			ratelimit.consume();
		}
		if (command.ratelimit.user) {
			let manager = command.ratelimit.user;

			let ratelimit = manager.acquire(interaction.user.id);

			if (ratelimit.limited) {
				return await interaction.createMessage({
					embeds: [
						{
							description: Main.utils.stripIndents(
								`
							\`\`\`asciidoc
							• Error :: This command is currently rate-limited for you. Please try again in ${formatter.format(ratelimit.remainingTime)}
							\`\`\`
							`
							),
							color: constants.numbers.colors.primary
						}
					],
					flags: MessageFlags.EPHEMERAL
				});
			}

			ratelimit.consume();
		}
	}

	await (command
		? command.run({ interaction: interaction, instance: Main })
		: await interaction.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: Command could not be found.
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				],
				flags: MessageFlags.EPHEMERAL
		  }));
}
