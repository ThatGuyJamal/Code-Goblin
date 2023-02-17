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

import { stripIndents } from 'common-tags';
import { BrandingColors } from './constants.js';
import {
	Client,
	TextChannel,
	TimestampStylesString,
	GuildMember,
	APIMessage,
	Message,
	DMChannel,
	Guild,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	codeBlock,
	CommandInteraction
} from 'discord.js';
import { Main } from '../index.js';

/** Returns the guild ids to register commands in. */
export function getGuildIds(): string[] {
	return Main.config.IsInDevelopmentMode ? [Main.config.DevelopmentGuildId] : [];
}

export interface GuildMessage extends Message {
	channel: TextChannel;
	readonly guild: Guild;
	readonly member: GuildMember;
}

export interface DMMessage extends Message {
	channel: DMChannel;
	readonly guild: null;
	readonly member: null;
}

export type MessageAcknowledgeable = TextChannel | GuildMessage;

export default class Utils {
	/**
	 * Sends a message to the log channels
	 * @param type of log channel
	 * @param message to send
	 * @param custom if the message input needs custom formatting
	 * @param name of the log
	 * @param options
	 * @returns
	 */
	public async sendToLogChannel(client: Client, type: 'error' | 'api' | 'premium', message: string, custom?: boolean, name?: string) {
		const log = client.channels.cache.get(
			type === 'error' ? Main.config.BotErrorLogChannelId : type === 'api' ? Main.config.BotApiLogChannelId : Main.config.BotPremiumLogChannelId
		) as TextChannel;

		if (!log) return;

		if (type === 'error') {
			if (custom) {
				await log.send({
					embeds: [
						{
							description: message,
							color: BrandingColors.Error,
							timestamp: new Date().toISOString()
						}
					]
				});
			} else {
				await log.send({
					embeds: [
						{
							description: this.stripIndents(
								`
\`\`\`asciidoc
• ${name ?? 'Error'} Log :: ${message}
\`\`\`
`
							),
							color: BrandingColors.Error,
							timestamp: new Date().toISOString()
						}
					]
				});
			}
		} else {
			if (custom) {
				await log.send({
					embeds: [
						{
							description: message,
							color: BrandingColors.Primary,
							timestamp: new Date().toISOString()
						}
					]
				});
			} else {
				await log.send({
					embeds: [
						{
							description: this.stripIndents(
								`
\`\`\`asciidoc
• ${name ?? 'Info'} Log :: ${message}
\`\`\`
`
							),
							color: BrandingColors.Primary,
							timestamp: new Date().toISOString()
						}
					]
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
	public FormatPluginStringData(member: GuildMember, str: string): string {
		return str
			.replaceAll(/{user}/g, this.userMention(member.id))
			.replaceAll(/{user_id}/g, member.id)
			.replaceAll(/{user_tag}/g, member.user.tag)
			.replaceAll(/{user_username}/g, member.user.username)
			.replaceAll(/{user_discriminator}/g, member.user.discriminator)
			.replaceAll(/{user_createdAt}/g, member.user.createdAt.toString())
			.replaceAll(/{server}/g, member.guild.name)
			.replaceAll(/{server_id}/g, member.guild.id)
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
	 * @param seconds - The time to format, represents an UNIX timestamp in seconds
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
	 * Checks whether a message was sent in a guild.
	 * @param message The message to check.
	 * @returns Whether the message was sent in a guild.
	 */
	public isGuildMessage(message: Message): message is GuildMessage {
		return message.guild !== null;
	}

	/**
	 * Checks whether a message was sent in a DM channel.
	 * @param message The message to check.
	 * @returns Whether the message was sent in a DM channel.
	 */
	public isPrivateMessage(message: Message): message is DMMessage {
		return message.guild === null;
	}

	/**
	 * Checks whether a given message is an instance of {@link Message}, and not {@link APIMessage}
	 * @param message The message to check
	 * @returns `true` if the message is an instance of `Message`, false otherwise.
	 */
	public isMessageInstance(message: APIMessage | Message): message is Message {
		return message instanceof Message;
	}

	public sendError(interaction: CommandInteraction, description: string, ephemeral = true) {
		// Core sapphire errors end in ".", so that needs to be accounted for.
		const parsedDescription = `❌ ${description.endsWith('.') ? description.slice(0, -1) : description}!`;

		const payload = {
			content: codeBlock(
				'css',
				`
     [Notice] - ${parsedDescription}
    `
			),
			// embeds: [createEmbed(parsedDescription, BrandingColors.Error)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setLabel('Need help')
						.setEmoji('❓')
						.setStyle(ButtonStyle.Link)
						.setURL(`${Main.config.BotSupportServerInvite}`)
				)
			],
			allowedMentions: { users: [interaction.user.id], roles: [] },
			ephemeral
		};

		// eslint-disable-next-line @typescript-eslint/unbound-method
		const replyFn = interaction.replied ? interaction.followUp : interaction.deferred ? interaction.editReply : (interaction.reply as any);
		return replyFn.call(interaction, payload);
	}

	public setToArray(set: Set<any>): any[] {
		return Array.from(set);
	}
}

export const GlobalUtils = new Utils();
