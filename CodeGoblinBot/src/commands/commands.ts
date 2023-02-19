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

import { ChatInputCommand, Command, RegisterBehavior } from '@sapphire/framework';
import { getGuildIds } from '../utils/utils';
import { Time } from '@sapphire/duration';
import { ExtendedCommand, ExtendedCommandOptions } from '../command';
import { ApplyOptions } from '@sapphire/decorators';
import { EmbedBuilder } from '@discordjs/builders';
import { BrandingColors, ButtonCustomId } from '../utils/constants';
import { Main } from '../index';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';

@ApplyOptions<ExtendedCommandOptions>({
	name: 'commands',
	description: 'Shows available commands in the bot',
	cooldownDelay: Time.Second * 5,
	enabled: true
})
export class HelpCommand extends ExtendedCommand {
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const commandsList = this.container.stores
			.get('commands')
			.map((command) => command.name)
			.map((name) => `${this.container.utilities.format.miniCodeBlock(`/${name}`)}`)
			.join(', ');

		const title = await this.t(interaction.channel as TextChannel, 'commands/general:cmd_commands.embed_title');
		const notice = await this.t(interaction.channel as TextChannel, 'commands/general:cmd_commands.embed_notice');

		const embed = new EmbedBuilder()
			.setTitle(title)
			.setDescription(commandsList)
			.setColor(BrandingColors.Primary)
			.addFields([
				{
					name: 'Notice',
					value: notice
				}
			])
			.setTimestamp()
			.setThumbnail(interaction.client.user.avatarURL({ extension: 'png' }));

		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(new ButtonBuilder().setURL(Main.config.BotSupportServerInvite).setLabel('Support Server').setStyle(ButtonStyle.Link))
			.addComponents(new ButtonBuilder().setURL(Main.config.BotOauthInviteLong).setLabel('Invite').setStyle(ButtonStyle.Link))
			.addComponents(
				new ButtonBuilder().setCustomId(ButtonCustomId.HELP_COMMAND_DELETE).setLabel('Delete').setStyle(ButtonStyle.Danger).setEmoji('🗑️')
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(ButtonCustomId.HELP_COMMAND_INFO)
					.setLabel('More information')
					.setStyle(ButtonStyle.Primary)
					.setEmoji('ℹ️')
			);

		return await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			guildIds: getGuildIds(),
			registerCommandIfMissing: Main.config.commands.register,
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			idHints: ['1076660988822159400']
		});
	}
}
