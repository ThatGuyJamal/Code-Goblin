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

import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ButtonCustomId } from '../utils/constants';
import { Main } from '../index';

export class ButtonHandler extends InteractionHandler {
	public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId === ButtonCustomId.HELP_COMMAND_DELETE) return this.some();
		if (interaction.customId === ButtonCustomId.HELP_COMMAND_INFO) return this.some();
		if (interaction.customId === ButtonCustomId.AUTOMATION_INFO) return this.some();

		return this.none();
	}

	public async run(interaction: ButtonInteraction) {
		if (interaction.customId === ButtonCustomId.HELP_COMMAND_DELETE) {
			await this.deleteMessage(interaction);
		}
		if (interaction.customId === ButtonCustomId.HELP_COMMAND_INFO) {
			await this.showHelp(interaction);
		}

		if (interaction.customId === ButtonCustomId.AUTOMATION_INFO) {
			await this.showAutomationInfo(interaction);
		}
	}

	private async showAutomationInfo(interaction: ButtonInteraction) {
		await interaction.reply({
			ephemeral: true,
			embeds: [
				{
					description: this.container.utilities.format.stripIndents(
						`
\`\`\`asciidoc
• Helpful Information :: You can use the following syntax to improve your automated messages:

• {user} :: The user who triggered the message
• {user.id} :: The user's ID
• {user.tag} :: The user's tag
• {user.username} :: The user's username
• {user.discriminator} :: The user's discriminator
• {user.createdAt} :: The user's account creation date
• {server.name} :: The server the message was sent in
• {server.id} :: The server's ID
• {memberCount} :: The server's member count

• Example :: Hello {user}, welcome to {server.name}!
\`\`\`
`
					)
				}
			]
		});

		await interaction.followUp({
			content: 'To update your automation, simply use the same command again with the new message!',
			ephemeral: true
		});
	}

	private async showHelp(interaction: ButtonInteraction) {
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setURL(Main.config.BotGitHubRepo)
					.setLabel('Source Code')
					.setStyle(ButtonStyle.Link)
					.setDisabled(false)
					.setEmoji('📝')
			)
			.addComponents(
				new ButtonBuilder().setURL('http://localhost:8080').setLabel('Dashboard').setStyle(ButtonStyle.Link).setDisabled(true).setEmoji('📊')
			)
			.addComponents(
				new ButtonBuilder()
					.setURL('http://localhost:8080')
					.setLabel('Documentation')
					.setStyle(ButtonStyle.Link)
					.setDisabled(true)
					.setEmoji('📚')
			);

		await interaction.reply({
			content: 'More information',
			ephemeral: true,
			components: [row]
		});
	}

	private async deleteMessage(interaction: ButtonInteraction) {
		// Check if the message is deletable, this is to prevent the bot from attempting to deleting messages that it cannot delete.
		if (interaction.message.deletable) {
			// Check if the person who sent the message is the same person who clicked the button
			if (interaction.user.id !== interaction.message.author.id) {
				await interaction.message.delete();
			} else {
				await interaction.reply({
					content: 'You cannot delete this message!'
				});
			}
		} else {
			await interaction.reply({
				content: 'I cannot delete this message, please check my permissions.',
				ephemeral: true
			});
		}
	}
}
