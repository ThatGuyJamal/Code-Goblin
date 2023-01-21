import { ButtonStyles, ComponentTypes, Message } from 'oceanic.js';
import config from '../../config/config.js';
import { GlobalStatsModel } from '../../database/index.js';
import type { LegacyCommand } from '../../typings/core/types.js';
import { constants, logger } from '../../utils/index.js';
import { Main } from '../index.js';

export default async function (message: Message) {
	if (!message.guild) return;
	if (!message.channel) return;
	if (message.author.bot) return;
	if (!message.member) return;

	const botMention = `<@${Main.DiscordClient.user.id}>`;

	const isOwners = Main.utils.isOwner(message.author.id);

	// Reply with the list of test commands if the bot is mentioned in a message
	if (message.content.startsWith(botMention)) {
		if (isOwners) {
			const legacyCommands = Main.collections.commands.legacyCommandStoreMap
				.map((cmd) => `• Command :: ${config.BotPrefix}${cmd.trigger}`)
				.join('\n');

			await message.channel?.createMessage({
				embeds: [
					{
						title: 'Legacy Commands',
						description: Main.utils.stripIndents(
							`
							\`\`\`asciidoc
							${legacyCommands}
							\`\`\`
							`
						),
						color: constants.numbers.colors.primary
					}
				]
			});
		} else {
			return await message.channel.createMessage({
				content: `*Legacy Commands Information*`,
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Info :: Please use my slash command </commands> to see a list of commands!
						\`\`\`
						`
						),
						color: constants.numbers.colors.tertiary
					}
				],
				components: [
					{
						type: ComponentTypes.ACTION_ROW,
						components: [
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Invite Bot',
								url: config.BotClientOAuth2Url
							},
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Code Repository',
								url: config.GithubRepository
							},
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Website',
								url: config.whisper_room.url,
								disabled: true
							}
						]
					}
				]
			});
		}
	}

	const command = Main.collections.commands.legacyCommandStoreMap.find((command) => {
		if (command.devOnly) if (!isOwners) return false;

		if (message.content.startsWith(`${config.BotPrefix}${command.trigger}`)) return true;
		if (message.content.startsWith(`${botMention} ${command.trigger}` || `${botMention}${command.trigger}`)) return true;
		return false;
	});

	if (!command) return;

	try {
		if (config.IsInDevelopmentMode) {
			logger.debug(`[${new Date().toISOString()}][command/${command.trigger}]: ${message.author.tag} (${message.author.id})`);
		}

		if (!config.IsInDevelopmentMode) {
			await GlobalStatsModel.findOneAndUpdate(
				{ find_id: 'global' },
				{ $inc: { commands_executed: 1 } },
				{
					upsert: true,
					new: true
				}
			);
		}
		
		await processLegacyCommand(message, command);
	} catch (error) {
		logger.error(error);
		await message.channel
			?.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: An error occurred while executing the command.
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				]
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

async function processLegacyCommand(message: Message, command: LegacyCommand | undefined) {
	if (!message.guild) return;
	if (!command) return;

	const isOwners = Main.utils.isOwner(message.author.id);

	const args = message.content.split(' ').slice(1);

	if (command.devOnly && !isOwners) {
		if (!Main.collections.keys.super_users.has(message.author.id)) {
			return await message.channel?.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: You are not allowed to use this command.
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				]
			});
		}
	}

	if (command?.helperUserOnly && !Main.collections.keys.helper_users.has(message.author.id)) {
		return await message.channel?.createMessage({
			embeds: [
				{
					description: Main.utils.stripIndents(
						`
						\`\`\`asciidoc
						• Error :: You are not allowed to use this command.
						\`\`\`
						`
					),
					color: constants.numbers.colors.primary
				}
			]
		});
	}

	if (command.guildLock && command.guildLock.length > 0 && !isOwners) {
		if (!command.guildLock.includes(message.guild.id))
			return await message.channel?.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: This command can't be used in this server.
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				]
			});
	}

	if (command?.requiredBotPermissions) {
		let hasPerms = message.guild.clientMember.permissions.has(...command.requiredBotPermissions);

		if (!hasPerms) {
			return await message.channel?.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: I need the following permissions: ${command.requiredBotPermissions} to execute this command.
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
		let hasPerms = message.member?.permissions.has(...command.requiredUserPermissions);

		if (!hasPerms) {
			return await message.channel?.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: You need the following permissions: ${command.requiredUserPermissions} to execute this command.
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				]
			});
		}
	}

	if (command.argsRequired) {
		if (args.length < command.argsRequired) {
			let missingString = command.argsRequired ? `Correct usage: ${command.trigger} ${command.argsUsage}` : 'Missing arguments';

			return await message.channel?.createMessage({
				embeds: [
					{
						description: Main.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: ${missingString}
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				]
			});
		}
	}

	await command.run({ instance: Main, message: message, args: args });
}
