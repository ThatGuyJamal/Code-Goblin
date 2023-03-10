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
import type { CreateImageRequest } from 'openai';
import { Configuration } from 'openai';
import { OpenAIImageWrapper } from '../openai/image';
import { AttachmentBuilder, TextChannel } from 'discord.js';
import { Main } from '..';
import { ExtendedCommand, ExtendedCommandOptions } from '../command';
import { ApplyOptions } from '@sapphire/decorators';

const ImagineAPI = new OpenAIImageWrapper(
	new Configuration({
		apiKey: Main.config.OpenAPIkey
	})
);

@ApplyOptions<ExtendedCommandOptions>({
	name: 'imagine',
	description: 'imagine the impossible',
	cooldownLimit: 5,
	cooldownDelay: Time.Minute * 1,
	enabled: true
})
export class ImagineCommand extends ExtendedCommand {
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		await interaction.deferReply();

		const Prompt = interaction.options.getString('prompt', true);

		await interaction.editReply({
			content: this.container.utilities.format.stripIndents(
				`
					\`\`\`asciidoc
					• Info :: ${await this.t(interaction.channel as TextChannel, 'commands/openai:imagine_command.loading')}
					\`\`\`
					`
			),
			allowedMentions: {
				repliedUser: true
			}
		});

		const imageOptions: CreateImageRequest = {
			prompt: Prompt,
			n: 1,
			size: '1024x1024',
			response_format: 'url',
			user: interaction.user.id
		};

		const image = await ImagineAPI.GenerateImage({ ...imageOptions });

		const imageURL = image ? image[0].Response.url : null;

		if (!image || !imageURL) {
			return interaction.editReply({
				content: this.container.utilities.format.stripIndents(
					`
						\`\`\`asciidoc
						• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/openai:imagine_command.failed')}
						\`\`\`
						`
				),
				allowedMentions: {
					repliedUser: true
				}
			});
		}

		let buffer = await ImagineAPI.GetBufferFromURL(imageURL);
		const att = new AttachmentBuilder(buffer, {
			name: 'imagine.png',
			description: 'generated imagine'
		});

		return await interaction.editReply({
			content: this.container.utilities.format.stripIndents(
				`
					\`\`\`asciidoc
					• Info :: ${await this.t(interaction.channel as TextChannel, 'commands/openai:imagine_command.success')}
					\`\`\`
					`
			),
			allowedMentions: {
				repliedUser: true
			},
			files: [att]
		});
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.setDMPermission(false)
					.addStringOption((options) => {
						return options.setName('prompt').setDescription('Imagine something and we will try to create it').setRequired(true);
					}),
			{
				guildIds: getGuildIds(),
				registerCommandIfMissing: Main.config.commands.register,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: ['1076660990290178110']
			}
		);
	}
}
