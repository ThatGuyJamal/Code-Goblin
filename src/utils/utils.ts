import {
	AnyTextChannelWithoutGroup,
	CommandInteraction,
	CreateMessageOptions,
	PermissionName,
	Member,
	MessageFlags,
	TextChannel,
	Uncached
} from 'oceanic.js';
import { constants, logger } from './index.js';
import { stripIndents } from 'common-tags';
import config from '../config/config.js';
import type Main from '../core/main.js';
import type { Command, CommandDataProp, LegacyCommand } from '../typings/core/types.js';
import type { TimestampStylesString } from '../typings/utils/types.js';

export default class Utils {
	private instance: Main;

	constructor(instance: Main) {
		this.instance = instance;
	}

	/**
	 * Sends a message to the log channels
	 * @param type of log channel
	 * @param message to send
	 * @param custom if the message input needs custom formatting
	 * @param name of the log
	 * @param options
	 * @returns
	 */
	public async sendToLogChannel(type: 'error' | 'api' | "premium", message: string, custom?: boolean, name?: string, options?: CreateMessageOptions) {
		const log = this.instance.DiscordClient.getChannel(
			type === 'error' ? config.BotErrorLogChannelId : type === 'api' ? config.BotApiLogChannelId : config.BotPremiumLogChannelId
		) as TextChannel;

		if (!log) return;

		if (type === 'error') {
			if (custom) {
				await log.createMessage({
					embeds: [
						{
							description: message,
							color: constants.numbers.colors.tertiary,
							timestamp: new Date().toISOString()
						}
					],
					flags: MessageFlags.EPHEMERAL
				});
			} else {
				await log.createMessage({
					embeds: [
						{
							description: this.instance.utils.stripIndents(
								`
\`\`\`asciidoc
• ${name ?? 'Error'} Log :: ${message}
\`\`\`
`
							),
							color: constants.numbers.colors.tertiary,
							timestamp: new Date().toISOString()
						}
					],
					flags: MessageFlags.EPHEMERAL
				});
			}
		} else {
			if (custom) {
				await log.createMessage({
					embeds: [
						{
							description: message,
							color: constants.numbers.colors.secondary,
							timestamp: new Date().toISOString()
						}
					],
					flags: MessageFlags.EPHEMERAL
				});
			} else {
				await log.createMessage({
					embeds: [
						{
							description: this.instance.utils.stripIndents(
								`
\`\`\`asciidoc
• ${name ?? 'Info'} Log :: ${message}
\`\`\`
`
							),
							color: constants.numbers.colors.secondary,
							timestamp: new Date().toISOString()
						}
					],
					flags: MessageFlags.EPHEMERAL
				});
			}
		}
	}

	/**
	 * Formats a string for a plugin using our needed regex replacements
	 * @param member
	 * @param str the string to format
	 * @returns
	 */
	public FormatPluginStringData(member: Member, str: string): string {
		return str
			.replaceAll(/{user}/g, member.mention)
			.replaceAll(/{user_id}/g, member.id)
			.replaceAll(/{user_tag}/g, member.tag)
			.replaceAll(/{user_username}/g, member.username)
			.replaceAll(/{user_discriminator}/g, member.discriminator)
			.replaceAll(/{user_createdAt}/g, member.createdAt.toString())
			.replaceAll(/{server}/g, member.guild.name)
			.replaceAll(/{server_id}/g, member.guild.id)
			.replaceAll(/{memberCount}/g, member.guild.memberCount.toString());
	}

	/**
	 * Gets the command list from the command store
	 */
	public get CommandList(): IterableIterator<Command> {
		return this.instance.collections.commands.commandStoreMap.values();
	}

	/**
	 * Adds a command to the command store
	 * @param cmd
	 */
	public addCommand(cmd: CommandDataProp) {
		try {
			// if the command is disabled, don't add it to the command store
			if (!cmd.props.disabled) {
				if (!cmd.props.requiredBotPermissions) cmd.props.requiredBotPermissions = ['SEND_MESSAGES', 'EMBED_LINKS'];
				if (!cmd.props.requiredUserPermissions) cmd.props.requiredUserPermissions = ['SEND_MESSAGES'];
				if (!cmd.props.disabled) cmd.props.disabled = false;

				this.instance.collections.commands.commandStoreMap.set(cmd.props.trigger, cmd.props);

				if (cmd.props.register === 'global') {
					this.instance.collections.commands.commandStoreArrayJsonGlobal.push(cmd.toJson());
				} else if (cmd.props.register === 'guild') {
					this.instance.collections.commands.commandStoreArrayJsonGuild.push(cmd.toJson());
				} else if (cmd.props.register === 'both') {
					this.instance.collections.commands.commandStoreArrayJsonGlobal.push(cmd.toJson());
					this.instance.collections.commands.commandStoreArrayJsonGuild.push(cmd.toJson());
				}
				logger.info(`Loaded ${cmd.props.trigger} command into memory.`);
			} else {
				logger.info(`${cmd.props.trigger} was not loaded into memory because it is disabled.`);
			}
		} catch (err) {
			logger.error(`[ERROR] Failed to load command ${cmd.props.trigger} into memory.`, err);
			logger.error(err);
		}
	}

	/**
	 * Adds a legacy command to the command store
	 * @param cmd
	 */
	public async addLegacyCommand(cmd: LegacyCommand) {
		try {
			// if the command is disabled, don't add it to the command store
			if (!cmd.disabled) {
				if (!cmd.requiredBotPermissions) cmd.requiredBotPermissions = ['SEND_MESSAGES', 'EMBED_LINKS'];
				if (!cmd.requiredUserPermissions) cmd.requiredUserPermissions = ['SEND_MESSAGES'];
				if (!cmd.disabled) cmd.disabled = false;

				this.instance.collections.commands.legacyCommandStoreMap.set(cmd.trigger, cmd);
				logger.info(`Loaded ${cmd.trigger} legacy command into memory.`);
			} else {
				logger.info(`${cmd.trigger} was not loaded into memory because it is disabled.`);
			}
		} catch (err) {
			logger.error(`[ERROR] Failed to load legacy command ${cmd.trigger} into memory.`, err);
			logger.error(err);
		}
	}

	/**
	 * Checks if a user has the required permissions
	 * @param i The interaction
	 * @param permissions The permissions to check for
	 * @returns
	 */
	public hasPermissions(i: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>, permissions: PermissionName): boolean {
		if (this.instance.collections.keys.super_users.has(i.user.id)) return true;
		if (i.member?.permissions.has(permissions)) return true;
		return false;
	}

	/**
	 * Checks if the user is a bot owner
	 * @param id The user id
	 * @returns
	 */
	public isOwner(id: string): boolean {
		return this.instance.collections.keys.super_users.has(id);
	}

	/**
	 * Creates a discord id from a mention
	 * @param mention
	 * @returns
	 */
	public parseUserIdFromMention(mention: string): string {
		return mention.replace(/[<@!>]/g, '');
	}

	/**
	 * Checks if a string is a user mention
	 * @param str
	 * @returns
	 */
	public isUserMention(str: string): boolean {
		// Check if the string is a mention
		if (!str.startsWith('<@') || !str.endsWith('>')) return false;
		return true;
	}

	/**
	 * Checks if a string is a user id
	 * @param str
	 * @returns
	 */
	public isUserId(str: string): boolean {
		return str.match(/^[0-9]{17,19}$/) !== null;
	}

	/**
	 * Converts a date string to a discord timestamp
	 * @example 1d => <t:86400:d>
	 * @param date
	 * @see https://discord.com/developers/docs/reference#message-formatting-timestamp-styles
	 * `t` Short time format, consisting of hours and minutes, e.g. 16:20.
	 * `T` Long time format, consisting of hours, minutes, and seconds, e.g. 16:20:30.
	 * `d` Short date format, consisting of day, month, and year, e.g. 20/04/2021.
	 * `D` Long date format, consisting of day, month, and year, e.g. 20 April 2021.
	 * `f` Short date-time format, consisting of short date and short time formats, e.g. 20 April 2021 16:20.
	 * `F` Long date-time format, consisting of long date and short time formats, e.g. Tuesday, 20 April 2021 16:20.
	 * `R` Relative time format, consisting of a relative duration format, e.g. 2 months ago.
	 * @returns
	 */
	public convertDateStringToDiscordTimeStamp(dateString: string, style?: TimestampStylesString): string {
		// const valid = this.validateDate(dateString);

		// if (!valid) return 'Invalid Date! Please use the format DD/MM/YYYY or DD-MM-YYYY';

		let time = Math.floor(new Date(dateString).getTime() / 1000);
		let format = style ? `<t:${time}:${style}>` : `<t:${time}>`;

		return format;
	}

	/**
	 * Strip all of the indentation from the beginning of each line in a multiline string
	 * @param str
	 * @returns
	 */
	public stripIndents(str: string) {
		return stripIndents(str);
	}

	validateDate(date: string) {
		var dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
		return dateRegex.test(date);
	}

	/**
	 * Wraps the content inside a codeblock with no language
	 *
	 * @param content - The content to wrap
	 */
	public codeBlock<C extends string>(content: C) {
		return `\`\`\`\n${content}\n\`\`\``;
	}

	/**
	 * Wraps the content inside a codeblock with the specified language
	 *
	 * @param language - The language for the codeblock
	 * @param content - The content to wrap
	 */
	public codeBlockWithLanguage(language: string, content?: string): string {
		return typeof content === 'undefined' ? `\`\`\`\n${language}\n\`\`\`` : `\`\`\`${language}\n${content}\n\`\`\``;
	}

	/**
	 * Wraps the content inside \`backticks\`, which formats it as inline code
	 *
	 * @param content - The content to wrap
	 */
	public inlineCode<C extends string>(content: C): `\`${C}\`` {
		return `\`${content}\``;
	}

	/**
	 * Formats the content into italic text
	 *
	 * @param content - The content to wrap
	 */
	public italic<C extends string>(content: C): `_${C}_` {
		return `_${content}_`;
	}

	/**
	 * Formats the content into bold text
	 *
	 * @param content - The content to wrap
	 */
	public bold<C extends string>(content: C): `**${C}**` {
		return `**${content}**`;
	}

	/**
	 * Formats the content into underscored text
	 *
	 * @param content - The content to wrap
	 */
	public underscore<C extends string>(content: C): `__${C}__` {
		return `__${content}__`;
	}

	/**
	 * Formats the content into strike-through text
	 *
	 * @param content - The content to wrap
	 */
	public strikethrough<C extends string>(content: C): `~~${C}~~` {
		return `~~${content}~~`;
	}

	/**
	 * Formats the content into a quote. This needs to be at the start of the line for Discord to format it
	 *
	 * @param content - The content to wrap
	 */
	public quote<C extends string>(content: C): `> ${C}` {
		return `> ${content}`;
	}

	/**
	 * Wraps the URL into `<>`, which stops it from embedding
	 *
	 * @param url - The URL to wrap
	 */
	public hideLinkEmbed(url: URL | string): string {
		return `<${url}>`;
	}

	/**
	 * Formats the content and the URL into a masked URL
	 *
	 * @param content - The content to display
	 * @param url - The URL the content links to
	 * @param title - The title shown when hovering on the masked link
	 */
	public hyperlink(content: string, url: URL | string, title?: string): string | undefined {
		return title ? `[${content}](${url} "${title}")` : `[${content}](${url})`;
	}

	/**
	 * Wraps the content inside spoiler (hidden text)
	 *
	 * @param content - The content to wrap
	 */
	public spoiler<C extends string>(content: C): `||${C}||` {
		return `||${content}||`;
	}

	/**
	 * Formats a user ID into a user mention
	 *
	 * @param userId - The user ID to format
	 */
	public userMention(userId: string): string {
		return `<@${userId}>`;
	}

	/**
	 * Formats a channel ID into a channel mention
	 *
	 * @param channelId - The channel ID to format
	 */
	public channelMention(channelId: string): string {
		return `<#${channelId}>`;
	}

	/**
	 * Formats a role ID into a role mention
	 *
	 * @param roleId - The role ID to format
	 */
	public roleMention(roleId: string): string {
		return `<@&${roleId}>`;
	}

	/**
	 * Formats an application command name, subcommand group name, subcommand name, and ID into an application command mention
	 *
	 * @param commandName - The application command name to format
	 * @param subcommandGroupName - The subcommand group name to format
	 * @param subcommandName - The subcommand name to format
	 * @param commandId - The application command ID to format
	 */
	chatInputApplicationCommandMention(commandName: string, subcommandGroupName: string, subcommandName?: string, commandId?: string): string {
		if (typeof commandId !== 'undefined') {
			return `</${commandName} ${subcommandGroupName} ${subcommandName!}:${commandId}>`;
		}

		if (typeof subcommandName !== 'undefined') {
			return `</${commandName} ${subcommandGroupName}:${subcommandName}>`;
		}

		return `</${commandName}:${subcommandGroupName}>`;
	}

	/**
	 * Formats an emoji ID into a fully qualified emoji identifier
	 *
	 * @param emojiId - The emoji ID to format
	 * @param animated - Whether the emoji is animated or not. Defaults to `false`
	 */
	formatEmoji(emojiId: string, animated = false): string {
		return `<${animated ? 'a' : ''}:_:${emojiId}>`;
	}

	/**
	 * Formats a channel link for a guild channel.
	 *
	 * @param channelId - The channel's id
	 * @param guildId - The guild's id
	 */
	channelLink(channelId: string, guildId?: string): string {
		return `https://discord.com/channels/${guildId ?? '@me'}/${channelId}`;
	}

	/**
	 * Formats a message link for a guild channel or a direct message channel.
	 *
	 * @param channelId - The channel's id
	 * @param messageId - The message's id
	 * @param guildId - The guild's id
	 */
	messageLink(channelId: string, messageId: string, guildId?: string) {
		return `${typeof guildId === 'undefined' ? this.channelLink(channelId) : this.channelLink(channelId, guildId)}/${messageId}`;
	}

	/**
	 * Formats the given timestamp into a short date-time string
	 *
	 * @param seconds - The time to format, represents an UNIX timestamp in seconds
	 * @param style - The style to use
	 */
	time(timeOrSeconds?: Date | number, style?: TimestampStylesString): string {
		if (typeof timeOrSeconds !== 'number') {
			// eslint-disable-next-line no-param-reassign
			timeOrSeconds = Math.floor((timeOrSeconds?.getTime() ?? Date.now()) / 1_000);
		}

		return typeof style === 'string' ? `<t:${timeOrSeconds}:${style}>` : `<t:${timeOrSeconds}>`;
	}
}
