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
import { Main } from '../index';
import type { TextChannel } from 'discord.js';
import { PermissionsBitField } from 'discord.js';

@ApplyOptions<ExtendedCommandOptions>({
	name: 'embed-generate',
	description: 'Create custom embed messages',
	cooldownDelay: Time.Second * 6,
	enabled: true,
	requiredUserPermissions: ['ManageGuild']
})
export class NewCommand extends ExtendedCommand {
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const titleArgument = interaction.options.getString('title', false);
		const descriptionArgument = interaction.options.getString('description', false);
		const colorArgument = interaction.options.getString('color', false);
		const thumbnailArgument = interaction.options.getString('thumbnail', false);
		const imageArgument = interaction.options.getString('image', false);
		const authorNameArgument = interaction.options.getString('author', false);
		const authorIconArgument = interaction.options.getString('authorIcon', false);
		const authorUrlArgument = interaction.options.getString('authorUrl', false);
		const footerArgument = interaction.options.getString('footer', false);
		const footerIconArgument = interaction.options.getString('footerIcon', false);
		const timestampArgument = interaction.options.getBoolean('timestamp', false);
		const contentArgument = interaction.options.getString('content', false);

		await interaction.deferReply({
			ephemeral: true
		});

		if (
			!titleArgument &&
			!descriptionArgument &&
			!colorArgument &&
			!thumbnailArgument &&
			!imageArgument &&
			!authorNameArgument &&
			!authorIconArgument &&
			!authorUrlArgument &&
			!footerArgument &&
			!timestampArgument
		) {
			return await interaction.editReply({
				content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.no_args')
			});
		}

		const embed = new EmbedBuilder();

		if (titleArgument) {
			if (titleArgument.length > 256)
				return await interaction.followUp({
					content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.title_too_long')
				});
			embed.setTitle(titleArgument);
		}

		if (descriptionArgument) {
			if (descriptionArgument.length > 4096)
				return await interaction.followUp({
					content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.description_too_long')
				});
			embed.setDescription(descriptionArgument);
		}

		if (colorArgument) {
			if (!colorArgument.match(/^#[0-9A-F]{6}$/i))
				return await interaction.followUp({
					content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.invalid_color')
				});
			let convertedColor = parseInt(colorArgument.replace('#', ''), 16);
			embed.setColor(convertedColor);
		}

		if (thumbnailArgument) {
			if (!thumbnailArgument.startsWith('http' || 'https'))
				return await interaction.followUp({
					content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.invalid_thumbnail')
				});
			embed.setThumbnail(thumbnailArgument);
		}

		if (imageArgument) {
			if (!imageArgument.startsWith('http' || 'https'))
				return await interaction.followUp({
					content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.invalid_image')
				});
			embed.setImage(imageArgument);
		}

		if (authorNameArgument) {
			if (!descriptionArgument)
				return await interaction.followUp({
					content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.no_description_with_author')
				});
			if (authorNameArgument.length > 256)
				return await interaction.followUp({
					content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.author_too_long')
				});
			embed.setAuthor({
				name: authorNameArgument,
				iconURL: authorIconArgument ?? undefined,
				url: authorUrlArgument ?? undefined
			});
		}

		if (footerArgument) {
			if (footerArgument.length > 2048)
				return await interaction.followUp({
					content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.footer_too_long')
				});
			embed.setFooter({
				text: footerArgument,
				iconURL: footerIconArgument ?? undefined
			});
		}

		if (timestampArgument) {
			embed.setTimestamp();
		}

		await interaction.editReply({
			content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.success')
		});

		return await interaction.channel
			?.send({
				content: contentArgument ?? undefined,
				embeds: [embed]
			})
			.catch(async () => {
				// this.container.client.logger.error(err);
				await interaction.editReply({
					content: await this.t(interaction.channel as TextChannel, 'commands/general:embed_command.failed')
				});
			});
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((builder) => builder.setName('title').setDescription('The title of the embed').setRequired(false))
					.addStringOption((builder) => builder.setName('description').setDescription('The description of the embed').setRequired(false))
					.addStringOption((builder) => builder.setName('url').setDescription('The url of the embed').setRequired(false))
					.addStringOption((builder) => builder.setName('color').setDescription('The color of the embed').setRequired(false))
					.addStringOption((builder) => builder.setName('footer').setDescription('The footer of the embed').setRequired(false))
					.addStringOption((builder) =>
						builder.setName('footer-icon').setDescription('The icon for the footer of the embed.').setRequired(false)
					)
					.addStringOption((builder) => builder.setName('author').setDescription('The author of the embed').setRequired(false))
					.addStringOption((builder) =>
						builder.setName('author-icon').setDescription('The icon for the author of the embed').setRequired(false)
					)
					.addStringOption((builder) =>
						builder.setName('author-url').setDescription('The url for the author of the embed').setRequired(false)
					)
					.addStringOption((builder) => builder.setName('thumbnail').setDescription('The thumbnail of the embed').setRequired(false))
					.addStringOption((builder) => builder.setName('image').setDescription('The image of the embed').setRequired(false))
					.addStringOption((builder) => builder.setName('content').setDescription('The content with the embed').setRequired(false))
					.addBooleanOption((builder) =>
						builder.setName('timestamp').setDescription('If the embed should have a timestamp').setRequired(false)
					)
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
			{
				guildIds: getGuildIds(),
				registerCommandIfMissing: Main.config.commands.register,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: ['1076660989510025257']
			}
		);
	}
}
