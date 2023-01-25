import { AnyInteractionGateway, ChannelTypes, CommandInteraction, InteractionTypes, MessageFlags } from 'oceanic.js';
import config from '../../config/config.js';
import { logger, constants } from '../../utils/index.js';
import { Main } from '../index.js';
import { DurationFormatter } from '@sapphire/duration';

const formatter = new DurationFormatter();

export default async function (interaction: AnyInteractionGateway) {
	if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
		try {
			if (config.IsInDevelopmentMode) {
				logger.debug(`[${new Date().toISOString()}][command/${interaction.data.name}]: ${interaction.user.tag} (${interaction.user.id})`);
			}
			await processCommandInteraction(interaction);
			await Main.database.schemas.statistics.UpdateCommandsExecuted();
		} catch (error) {
			await Main.database.schemas.statistics.UpdateCommandsFailed();
			logger.error(error);
			await interaction
				.createMessage({
					content: `An error occurred while running \`/${interaction.data.name}\` command.`
				})
				.catch(() => {});
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
	const command = Main.collections.commands.commandStoreMap.get(interaction.data.name);

	if (!command) {
		return await interaction.createMessage({
			embeds: [
				{
					description: Main.utils.stripIndents(
						`
						\`\`\`asciidoc
						• Error :: This command does not exist.
						\`\`\`
						`
					),
					color: constants.numbers.colors.primary
				}
			],
			flags: MessageFlags.EPHEMERAL
		});
	}

	const isOwner = Main.utils.isOwner(interaction.user.id);

	if (command.disabled && !isOwner) {
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

	if (command.superUserOnly && !isOwner) {
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

	if (command.premiumOnly && !Main.database.schemas.premiumUser.CheckIfPremiumUser(interaction.user.id) && !isOwner) {
		return await interaction.createMessage({
			embeds: [
				{
					description: Main.utils.stripIndents(
						`
						\`\`\`asciidoc
						• Error :: This command is only available to premium users.
						\`\`\`
						
						You can get premium by contacting the developers in the ${Main.utils.hyperlink('Support Server Link', config.DevelopmentServerInviteUrl)}.
						`
					),
					color: constants.numbers.colors.primary
				}
			],
			flags: MessageFlags.EPHEMERAL
		});
	}

	if (command.helperUserOnly && !isOwner) {
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

	if (command.requiredBotPermissions) {
		if (!interaction.appPermissions?.has(...command.requiredBotPermissions) && interaction.channel?.type !== ChannelTypes.DM) {
			return await interaction.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: I'm Missing Permissions: ${command.requiredBotPermissions}
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				]
			});
		}
	}

	if (command.requiredUserPermissions && !isOwner) {
		if (!interaction.member?.permissions.has(...command.requiredUserPermissions) && interaction.channel?.type !== ChannelTypes.DM) {
			return await interaction.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: Your Missing Permissions: ${command.requiredUserPermissions}
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

	if (command.ratelimit && !isOwner) {
		let globalManager = command.ratelimit.global;
		let guildManager = command.ratelimit.guild;
		let userManager = command.ratelimit.user;

		let GlobalRateLimit = globalManager?.acquire(interaction.data.name);

		let UserRateLimit = userManager?.acquire(interaction.user.id);

		if (command.ratelimit.global) {
			if (GlobalRateLimit?.limited) {
				return await interaction.createMessage({
					embeds: [
						{
							description: Main.utils.stripIndents(
								`
							\`\`\`asciidoc
							• Error :: This command is currently rate-limited globally. Please try again in ${formatter.format(GlobalRateLimit.remainingTime)}
							\`\`\`
							`
							),
							color: constants.numbers.colors.primary
						}
					],
					flags: MessageFlags.EPHEMERAL
				});
			}
		} else {
			GlobalRateLimit?.consume();
		}

		if (interaction.guild) {
			let GuildRateLimit = guildManager?.acquire(interaction.guild.id);
			if (command.ratelimit.guild) {
				if (GuildRateLimit?.limited) {
					return await interaction.createMessage({
						embeds: [
							{
								description: Main.utils.stripIndents(
									`
							\`\`\`asciidoc
							• Error :: This command is currently rate-limited in this guild. Please try again in ${formatter.format(GuildRateLimit.remainingTime)}
							\`\`\`
							`
								),
								color: constants.numbers.colors.primary
							}
						],
						flags: MessageFlags.EPHEMERAL
					});
				}
			} else {
				GuildRateLimit?.consume();
			}
		}
		if (command.ratelimit.user) {
			if (UserRateLimit?.limited) {
				return await interaction.createMessage({
					embeds: [
						{
							description: Main.utils.stripIndents(
								`
							\`\`\`asciidoc
							• Error :: This command is currently rate-limited for you. Please try again in ${formatter.format(UserRateLimit.remainingTime)}
							\`\`\`
							`
							),
							color: constants.numbers.colors.primary
						}
					],
					flags: MessageFlags.EPHEMERAL
				});
			}
		} else {
			UserRateLimit?.consume();
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
