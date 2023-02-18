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
import { Main } from '../index';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock, CommandInteraction, TextChannel } from 'discord.js';
import { BrandingColors } from './constants';

declare module '@sapphire/plugin-utilities-store' {
	export interface Utilities {
		command: CommandUtility;
	}
}

type LogChannelType = 'error' | 'api' | 'premium' | 'join-leave';

export class CommandUtility extends Utility {
	public constructor(context: Utility.Context, options: Utility.Options) {
		super(context, {
			...options,
			name: 'command'
		});
	}

	/** Returns the guild ids to register commands in. */
	public getGuildIds() {
		return Main.config.IsInDevelopmentMode ? [Main.config.DevelopmentGuildId] : undefined;
	}

	public sendError(interaction: CommandInteraction, description: string, ephemeral = true) {
		// Core sapphire errors end in ".", so that needs to be accounted for.
		const parsedDescription = `❌ ${description.endsWith('.') ? description.slice(0, -1) : description}!`;

		const payload = {
			content: codeBlock('css', `[Notice] - ${parsedDescription}`),
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

	public async sendToLogChannel(type: LogChannelType, message: string, custom?: boolean, name?: string) {
		let logChannelId: string;
		let log: TextChannel | undefined;

		switch (type) {
			case 'error':
				logChannelId = Main.config.BotErrorLogChannelId;
				log = await this.GetTextChannel(logChannelId);
				if (!log) return;
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
								description: this.container.utilities.format.stripIndents(
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
				break;
			case 'api':
				logChannelId = Main.config.BotApiLogChannelId;
				log = await this.GetTextChannel(logChannelId);
				if (!log) return;
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
								description: this.container.utilities.format.stripIndents(
									`
\`\`\`asciidoc
• ${name ?? 'API'} Log :: ${message}
\`\`\`
`
								),
								color: BrandingColors.Error,
								timestamp: new Date().toISOString()
							}
						]
					});
				}
				break;
			case 'premium':
				logChannelId = Main.config.BotPremiumLogChannelId;
				log = await this.GetTextChannel(logChannelId);
				if (!log) return;
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
								description: this.container.utilities.format.stripIndents(
									`
\`\`\`asciidoc
• ${name ?? 'Premium'} Log :: ${message}
\`\`\`
`
								),
								color: BrandingColors.Error,
								timestamp: new Date().toISOString()
							}
						]
					});
				}
				break;
			case 'join-leave':
				logChannelId = Main.config.BotJoinLeaveLogChannelId;
				log = await this.GetTextChannel(logChannelId);
				if (!log) return;
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
								description: this.container.utilities.format.stripIndents(
									`
\`\`\`asciidoc
• ${name ?? 'Join/Leave'} Log :: ${message}
\`\`\`
`
								),
								color: BrandingColors.Error,
								timestamp: new Date().toISOString()
							}
						]
					});
				}
				break;
			default:
				break;
		}
	}

	/**
	 * Returns a text channel from the cache.
	 * @param channelId The id of the channel to get.
	 * @returns The text channel.
	 */
	public async GetTextChannel(channelId: string): Promise<TextChannel | undefined> {
		return (await this.container.client.channels.cache.get(channelId)) as TextChannel | undefined;
	}
}
