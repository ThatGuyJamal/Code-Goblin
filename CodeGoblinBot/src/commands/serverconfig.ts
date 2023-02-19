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
import { Time } from '@sapphire/duration';
import { ExtendedCommand, ExtendedCommandOptions } from '../command';
import { ApplyOptions } from '@sapphire/decorators';
import { getGuildIds } from '../utils/utils';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v9';
import type { TextChannel } from 'discord.js';
import { ServerConfigModel } from '../database/mongodb/models/config';

const LanguageChoices: APIApplicationCommandOptionChoice<string>[] = [
	{
		name: 'English',
		value: 'en-US'
	},
	{
		name: 'Spanish',
		value: 'es-ES'
	}
];

@ApplyOptions<ExtendedCommandOptions>({
	name: 'configure',
	description: 'Configure the bot for your server',
	cooldownDelay: Time.Second * 5,
	enabled: true
})
export class NewCommand extends ExtendedCommand {
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case 'language':
				await this.language(interaction);
				break;
			case 'view':
				await this.view(interaction);
				break;
			default:
				await interaction.reply({
					content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:invalid_subcommand')
				});
		}
	}

	private async language(interaction: Command.ChatInputCommandInteraction) {
		const dialect = interaction.options.getString('dialect', true);

		// Check if the language is spanish
		if (dialect === 'es-ES') {
			return await interaction.reply({
				content: `Spanish is not supported yet! Please try again later.`,
				ephemeral: true
			});
		}

		await ServerConfigModel.UpdateServerConfig({
			guild_id: interaction.guildId!,
			language: dialect
		});

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:language.success', {
				replace: {
					language: dialect
				}
			})
		});
	}

	private async view(interaction: Command.ChatInputCommandInteraction) {
		const config = await ServerConfigModel.GetServerConfig(interaction.guildId!);

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:view.success', {
				replace: {
					language: config?.language ?? 'en-US'
				}
			})
		});
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((subcommand) => {
						return subcommand.setName('view').setDescription('View the current server configuration');
					})
					.addSubcommand((subcommand) => {
						return subcommand
							.setName('language')
							.setDescription('Configure the bot language in this server')
							.addStringOption((option) => {
								return option
									.setName('dialect')
									.setDescription('The dialect to set')
									.addChoices(...LanguageChoices)
									.setRequired(true);
							});
					}),
			{
				guildIds: getGuildIds(),
				registerCommandIfMissing: true,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: []
			}
		);
	}
}
