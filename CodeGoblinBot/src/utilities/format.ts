/**
 *  Code Goblin - A discord bot for programmers.

 Copyright (C) 2022, ThatGuyJamal and contributors
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.
 */

import { Utility } from '@sapphire/plugin-utilities-store';
import type { GuildMember, TimestampStylesString } from 'discord.js';
import { stripIndents } from 'common-tags';
import type { Colors } from '../utils/constants';
import { isNullishOrEmpty } from '@sapphire/utilities';

declare module '@sapphire/plugin-utilities-store' {
	export interface Utilities {
		format: FormatUtility;
	}
}

export class FormatUtility extends Utility {
	public constructor(context: Utility.Context, options: Utility.Options) {
		super(context, {
			...options,
			name: 'format'
		});
	}

	/**
	 * Formats a string for a plugin using our needed regex replacements
	 * @param member
	 * @param str the string to format
	 * @returns
	 */
	public FormatPluginStringData(member: GuildMember, str: string): string {
		return str
			.replaceAll(/{user}/g, this.userMention(member.id))
			.replaceAll(/{user.id}/g, member.id)
			.replaceAll(/{user.tag}/g, member.user.tag)
			.replaceAll(/{user.username}/g, member.user.username)
			.replaceAll(/{user.discriminator}/g, member.user.discriminator)
			.replaceAll(/{user.createdAt}/g, member.user.createdAt.toString())
			.replaceAll(/{server.name}/g, member.guild.name)
			.replaceAll(/{server.id}/g, member.guild.id)
			.replaceAll(/{memberCount}/g, member.guild.memberCount.toString());
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
		return !(!str.startsWith('<@') || !str.endsWith('>'));
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
	 * @see https://discord.com/developers/docs/reference#message-formatting-timestamp-styles
	 * `t` Short time format, consisting of hours and minutes, e.g. 16:20.
	 * `T` Long time format, consisting of hours, minutes, and seconds, e.g. 16:20:30.
	 * `d` Short date format, consisting of day, month, and year, e.g. 20/04/2021.
	 * `D` Long date format, consisting of day, month, and year, e.g. 20 April 2021.
	 * `f` Short date-time format, consisting of short date and short time formats, e.g. 20 April 2021 16:20.
	 * `F` Long date-time format, consisting of long date and short time formats, e.g. Tuesday, 20 April 2021 16:20.
	 * `R` Relative time format, consisting of a relative duration format, e.g. 2 months ago.
	 * @returns
	 * @param dateString
	 * @param style
	 */
	public convertDateStringToDiscordTimeStamp(dateString: string, style?: TimestampStylesString): string {
		// const valid = this.validateDate(dateString);

		// if (!valid) return 'Invalid Date! Please use the format DD/MM/YYYY or DD-MM-YYYY';

		let time = Math.floor(new Date(dateString).getTime() / 1000);
		return style ? `<t:${time}:${style}>` : `<t:${time}>`;
	}

	/**
	 * Strip all of the indentation from the beginning of each line in a multiline string
	 * @param str
	 * @returns
	 */
	public stripIndents(str: string) {
		return stripIndents(str);
	}

	/**
	 * Wraps the content inside a code-block with no language
	 *
	 * @param content - The content to wrap
	 */
	public codeBlock(content: string): string {
		return `\`\`\`\n${content}\n\`\`\``;
	}

	public miniCodeBlock(content: string): string {
		return `\`${content}\``;
	}

	/**
	 * Wraps the content inside a code-block with the specified language
	 *
	 * @param language - The language for the code-block
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
	public channelMention(channelId: string | null | undefined): string {
		return channelId ? `<#${channelId}>` : 'No channel found';
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
	public chatInputApplicationCommandMention(commandName: string, subcommandGroupName: string, subcommandName?: string, commandId?: string): string {
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
	public formatEmoji(emojiId: string, animated = false): string {
		return `<${animated ? 'a' : ''}:_:${emojiId}>`;
	}

	/**
	 * Formats a channel link for a guild channel.
	 *
	 * @param channelId - The channel's id
	 * @param guildId - The guild's id
	 */
	public channelLink(channelId: string, guildId?: string): string {
		return `https://discord.com/channels/${guildId ?? '@me'}/${channelId}`;
	}

	/**
	 * Formats a message link for a guild channel or a direct message channel.
	 *
	 * @param channelId - The channel's id
	 * @param messageId - The message's id
	 * @param guildId - The guild's id
	 */
	public messageLink(channelId: string, messageId: string, guildId?: string) {
		return `${typeof guildId === 'undefined' ? this.channelLink(channelId) : this.channelLink(channelId, guildId)}/${messageId}`;
	}

	/**
	 * Formats the given timestamp into a short date-time string
	 *
	 * @param timeOrSeconds
	 * @param style - The style to use
	 */
	public time(timeOrSeconds?: Date | number, style?: TimestampStylesString): string {
		if (typeof timeOrSeconds !== 'number') {
			// eslint-disable-next-line no-param-reassign
			timeOrSeconds = Math.floor((timeOrSeconds?.getTime() ?? Date.now()) / 1_000);
		}

		return typeof style === 'string' ? `<t:${timeOrSeconds}:${style}>` : `<t:${timeOrSeconds}>`;
	}

	/**
	 * Converts a set to an array
	 * @param set
	 */
	public fromSetToArray(set: Set<any>): any[] {
		return Array.from(set);
	}

	public colorToStyle(color: Colors): string {
		return `color: #${color.toString(16)}`;
	}

	/**
	 * Converts an array of strings to a string with a new line and space between each element
	 * @param array
	 * @param codeBlock
	 */
	public arrayOfStringsToStyle(array: string[], codeBlock: boolean): string {
		let str = array.filter((string) => !isNullishOrEmpty(string)).map((string) => string);
		if (codeBlock) {
			return str.map((string, index) => `${index + 1} - ${this.miniCodeBlock(string)}`).join('\n');
		}
		return str.map((string, index) => `${index + 1} - ${string}`).join('\n');
	}

	/**
	 * Converts a permission number to a string to display
	 * @param permissions
	 * @returns {string} The permissions as a string
	 */
	public permissionsToString(permissions: bigint | bigint[]): string {
		if (typeof permissions === 'bigint') {
			return this.permissionsToString([permissions]);
		}

		const permissionsArray: string[] = [];

		for (const permission of permissions) {
			for (const [key, value] of Object.entries(permissionBits)) {
				if ((permission & value) === value) {
					permissionsArray.push(key);
				}
			}
		}

		return permissionsArray.join(', ');
	}
}

/**
 * The bits for each permission
 * @see https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
 */
const permissionBits = {
	CREATE_INSTANT_INVITE: 1n << 0n,
	KICK_MEMBERS: 1n << 1n,
	BAN_MEMBERS: 1n << 2n,
	ADMINISTRATOR: 1n << 3n,
	MANAGE_CHANNELS: 1n << 4n,
	MANAGE_GUILD: 1n << 5n,
	ADD_REACTIONS: 1n << 6n,
	VIEW_AUDIT_LOG: 1n << 7n,
	PRIORITY_SPEAKER: 1n << 8n,
	STREAM: 1n << 9n,
	VIEW_CHANNEL: 1n << 10n,
	SEND_MESSAGES: 1n << 11n,
	SEND_TTS_MESSAGES: 1n << 12n,
	MANAGE_MESSAGES: 1n << 13n,
	EMBED_LINKS: 1n << 14n,
	ATTACH_FILES: 1n << 15n,
	READ_MESSAGE_HISTORY: 1n << 16n,
	MENTION_EVERYONE: 1n << 17n,
	USE_EXTERNAL_EMOJIS: 1n << 18n,
	VIEW_GUILD_INSIGHTS: 1n << 19n,
	CONNECT: 1n << 20n,
	SPEAK: 1n << 21n,
	MUTE_MEMBERS: 1n << 22n,
	DEAFEN_MEMBERS: 1n << 23n,
	MOVE_MEMBERS: 1n << 24n,
	USE_VAD: 1n << 25n,
	CHANGE_NICKNAME: 1n << 26n,
	MANAGE_NICKNAMES: 1n << 27n,
	MANAGE_ROLES: 1n << 28n,
	MANAGE_WEBHOOKS: 1n << 29n,
	MANAGE_EMOJIS: 1n << 30n,
	USE_APPLICATION_COMMANDS: 1n << 31n,
	REQUEST_TO_SPEAK: 1n << 32n,
	MANAGE_THREADS: 1n << 34n,
	USE_PUBLIC_THREADS: 1n << 35n,
	USE_PRIVATE_THREADS: 1n << 36n,
	USE_EXTERNAL_STICKERS: 1n << 37n,
	SEND_MESSAGES_IN_THREADS: 1n << 38n,
	START_EMBEDDED_ACTIVITIES: 1n << 39n,
	MODERATE_MEMBERS: 1n << 40n
};
