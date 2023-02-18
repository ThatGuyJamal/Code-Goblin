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

import { ChatInputCommand, Command, Events, RegisterBehavior } from '@sapphire/framework';
import { getGuildIds } from '../utilities/utils';
import { Time } from '@sapphire/duration';
import { ExtendedCommand, ExtendedCommandOptions } from '../command';
import { ApplyOptions } from '@sapphire/decorators';
import { type APIApplicationCommandOptionChoice, ChannelType } from 'discord-api-types/v9';
import { WelcomeModel } from '../database/mongodb/models/welcome';
import { Main } from '../index';
import { GoodbyeModel } from '../database/mongodb/models/goodbye';
import type { GuildMember } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, TextChannel } from 'discord.js';
import { ButtonCustomId } from '../utilities/constants';

const AutomationChoices: APIApplicationCommandOptionChoice<string>[] = [
	{
		name: 'Welcome Plugin',
		value: 'wp'
	},
	{
		name: 'Goodbye Plugin',
		value: 'gp'
	}
];

@ApplyOptions<ExtendedCommandOptions>({
	name: 'automate',
	description: 'Automate actions in your server',
	cooldownDelay: Time.Second * 5,
	enabled: true,
	requiredUserPermissions: ['ManageGuild']
})
export class AutomateCommand extends ExtendedCommand {
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case 'welcome-create':
				return await this.welcomeCreate(interaction);
			case 'welcome-view':
				return await this.welcomeView(interaction);
			case 'welcome-delete':
				return await this.welcomeDelete(interaction);
			case 'goodbye-create':
				return await this.goodbyeCreate(interaction);
			case 'goodbye-view':
				return await this.goodbyeView(interaction);
			case 'goodbye-delete':
				return await this.goodbyeDelete(interaction);
			case 'simulate':
				return await this.simulatePlugin(interaction);
			default:
				return await interaction.reply({
					content: 'Please provide a valid subcommand!',
					ephemeral: true
				});
		}
	}

	private async welcomeCreate(interaction: Command.ChatInputCommandInteraction) {
		const welcomeChannel = interaction.options.getChannel('welcome-channel', true) as TextChannel;
		const welcomeMessage = interaction.options.getString('welcome-message', true);

		if (!welcomeChannel && !welcomeMessage) {
			return await interaction.reply({
				content: 'Please provide a welcome channel and a welcome message!',
				ephemeral: true
			});
		}

		const data = await WelcomeModel.GetWelcome(interaction.guildId!);

		// if data is found, update the welcome message instead of creating a new one
		if (data) {
			return this.updateData('welcome', interaction, welcomeChannel.id, welcomeMessage);
		}

		await WelcomeModel.CreateWelcome({
			guild_id: interaction.guildId!,
			channel_id: welcomeChannel.id,
			content: welcomeMessage,
			enabled: true
		});

		return await interaction.reply({
			content: `Welcome automation created!`,
			components: [this.buildInfoButton()]
		});
	}

	private async welcomeView(interaction: Command.ChatInputCommandInteraction) {
		const data = await WelcomeModel.GetWelcome(interaction.guildId!);

		if (!data || !data.content) {
			return await interaction.reply({
				content: `No data found for this server!`,
				ephemeral: true
			});
		}

		return await interaction.reply({
			content: `Welcome Channel: ${this.container.utilities.format.channelMention(data.channel_id)}\nWelcome message: ${data.content}`,
			allowedMentions: {
				roles: [],
				users: []
			}
		});
	}

	private async welcomeDelete(interaction: Command.ChatInputCommandInteraction) {
		const data = await WelcomeModel.GetWelcome(interaction.guildId!);

		if (!data) {
			return await interaction.reply({
				content: `No data found for this server!`,
				ephemeral: true
			});
		}

		await WelcomeModel.deleteOne({ guild_id: interaction.guildId! });

		return await interaction.reply({
			content: `Welcome automation deleted!`
		});
	}

	private async goodbyeCreate(interaction: Command.ChatInputCommandInteraction) {
		const goodbyeChannel = interaction.options.getChannel('goodbye-channel', true) as TextChannel;
		const goodbyeMessage = interaction.options.getString('goodbye-message', true);

		if (!goodbyeChannel && !goodbyeMessage) {
			return await interaction.reply({
				content: 'Please provide a goodbye channel and a goodbye message!',
				ephemeral: true
			});
		}

		const data = await GoodbyeModel.GetGoodbye(interaction.guildId!);

		// if data is found, update the welcome message instead of creating a new one
		if (data) {
			return this.updateData('goodbye', interaction, goodbyeChannel?.id, goodbyeMessage);
		}

		await GoodbyeModel.CreateGoodbye({
			guild_id: interaction.guildId!,
			channel_id: goodbyeChannel?.id,
			content: goodbyeMessage!,
			enabled: true
		});

		return await interaction.reply({
			content: `Goodbye automation created!`,
			components: [this.buildInfoButton()]
		});
	}

	private async goodbyeView(interaction: Command.ChatInputCommandInteraction) {
		const data = await GoodbyeModel.GetGoodbye(interaction.guildId!);

		if (!data || !data.content || !data.channel_id) {
			return await interaction.reply({
				content: `No data found for this server!`,
				ephemeral: true
			});
		}

		return await interaction.reply({
			content: `Goodbye Channel: ${this.container.utilities.format.channelMention(data.channel_id)}\nGoodbye message: ${data.content}`,
			allowedMentions: {
				roles: [],
				users: []
			}
		});
	}

	private async goodbyeDelete(interaction: Command.ChatInputCommandInteraction) {
		const data = await GoodbyeModel.GetGoodbye(interaction.guildId!);

		if (!data) {
			return await interaction.reply({
				content: `No data found for this server!`,
				ephemeral: true
			});
		}

		await GoodbyeModel.deleteOne({ guild_id: interaction.guildId! });

		return await interaction.reply({
			content: `Goodbye automation deleted!`
		});
	}

	private async updateData(type: 'welcome' | 'goodbye', interaction: Command.ChatInputCommandInteraction, channel: string, message: string) {
		switch (type) {
			case 'welcome':
				await WelcomeModel.UpdateWelcome({
					guild_id: interaction.guildId!,
					channel_id: channel,
					content: message,
					enabled: true
				});

				return await interaction.reply({
					content: `Welcome automation updated!`,
					components: [this.buildInfoButton()]
				});
			case 'goodbye':
				await GoodbyeModel.UpdateGoodbye({
					guild_id: interaction.guildId!,
					channel_id: channel,
					content: message,
					enabled: true
				});

				return await interaction.reply({
					content: `Goodbye automation updated!`,
					components: [this.buildInfoButton()]
				});
			default:
				return await interaction.reply({
					content: 'Please provide a valid subcommand!'
				});
		}
	}

	private async simulatePlugin(interaction: Command.ChatInputCommandInteraction) {
		const plugin = interaction.options.getString('plugin', true);

		switch (plugin) {
			case 'wp':
				const data = await WelcomeModel.GetWelcome(interaction.guildId!);

				if (!data || !data.content || !data.channel_id) {
					return await interaction.reply({
						content: `No data found for this server!`,
						ephemeral: true
					});
				}

				const channel = interaction.client.channels.cache.get(data.channel_id) as TextChannel | undefined;

				if (!channel) {
					return await interaction.reply({
						content: `No channel found!`,
						ephemeral: true
					});
				}

				if (!channel.permissionsFor(interaction.guild!.members.me!)?.has(PermissionsBitField.Flags.SendMessages)) {
					return await interaction.reply({
						content: `I do not have permission to send messages in ${this.container.utilities.format.channelMention(data.channel_id)}!}`,
						ephemeral: true
					});
				}

				interaction.client.emit(Events.GuildMemberAdd, interaction.member as GuildMember);

				return await interaction.reply({
					embeds: [
						{
							description: `Welcome automation simulated!`
						}
					]
				});
			case 'gp':
				const data2 = await GoodbyeModel.GetGoodbye(interaction.guildId!);

				if (!data2 || !data2.content || !data2.channel_id) {
					return await interaction.reply({
						content: `No data found for this server!`,
						ephemeral: true
					});
				}

				const channel2 = interaction.guild!.channels.cache.get(data2.channel_id) as TextChannel | undefined;

				if (!channel2) {
					return await interaction.reply({
						content: `No channel found!`,
						ephemeral: true
					});
				}

				if (!channel2.permissionsFor(interaction.guild!.members.me!)?.has(PermissionsBitField.Flags.SendMessages)) {
					return await interaction.reply({
						content: `I do not have permission to send messages!`,
						ephemeral: true
					});
				}

				interaction.client.emit(Events.GuildMemberRemove, interaction.member as GuildMember);

				return await interaction.reply({
					embeds: [
						{
							description: `Goodbye automation simulated!`
						}
					]
				});
			default:
				return await interaction.reply({
					content: `Invalid plugin!`
				});
		}
	}

	private buildInfoButton(): ActionRowBuilder<ButtonBuilder> {
		return new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder().setCustomId(ButtonCustomId.AUTOMATION_INFO).setLabel('More Info').setStyle(ButtonStyle.Primary)
		);
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName('welcome-create')
							.setDescription('Automate welcome messages')
							.addChannelOption((option) =>
								option.setName('welcome-channel').setDescription('The channel to send the welcome message in').setRequired(true)
							)
							.addStringOption((option) =>
								option.setName('welcome-message').setDescription('The message to send when a user joins').setRequired(true)
							);
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand.setName('welcome-view').setDescription(`View the welcome message for this server`);
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand.setName(`welcome-delete`).setDescription(`Delete the welcome message for this server`);
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						// @ts-ignore
						return subcommand
							.setName('goodbye-create')
							.setDescription('Automate goodbye messages')
							.addChannelOption((option) =>
								option
									.setName('goodbye-channel')
									.setDescription('The channel to send the goodbye message in')
									.setRequired(true)
									.addChannelTypes(ChannelType.GuildText)
							)
							.addStringOption((option) =>
								option.setName('goodbye-message').setDescription('The message to send when a user leaves').setRequired(true)
							);
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand.setName(`goodbye-delete`).setDescription(`Delete the goodbye message for this server`);
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand.setName(`goodbye-view`).setDescription(`View the goodbye message for this server`);
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName(`simulate`)
							.setDescription(`Simulate the automation plugins`)
							.addStringOption((option) =>
								option
									.setName(`plugin`)
									.setDescription(`The plugin to test`)
									.setRequired(true)
									.addChoices(...AutomationChoices)
									.setRequired(true)
							);
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
			{
				guildIds: getGuildIds(),
				registerCommandIfMissing: Main.config.commands.register,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: []
			}
		);
	}
}
