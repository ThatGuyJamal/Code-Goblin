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
import { type APIApplicationCommandOptionChoice, ChannelType } from 'discord-api-types/v9';
import type { TextChannel } from 'discord.js';
import { PermissionsBitField } from 'discord.js';
import { ServerConfigModel } from '../database/mongodb/models/config';
import { UserReputationModel } from '../database/mongodb/models/reputation';

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

const ReputationEnabledChoices: APIApplicationCommandOptionChoice<string>[] = [
	{
		name: 'Enabled',
		value: 'enabled'
	},
	{
		name: 'Disabled',
		value: 'disabled'
	}
];

@ApplyOptions<ExtendedCommandOptions>({
	name: 'configure',
	description: 'Configure the bot for your server',
	cooldownDelay: Time.Second * 5,
	enabled: true,
	requiredUserPermissions: ['ManageGuild']
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
			case 'clear':
				await this.clear(interaction);
				break;
			case 'reputation-status':
				await this.reputationStatus(interaction);
				break;
			case 'reputation-gains':
				await this.reputationGains(interaction);
				break;
			case 'reputation-channel':
				await this.reputationChannel(interaction);
				break;
			case 'reputation-message-status':
				await this.reputationMessageStatus(interaction);
				break;
			case 'reputation-message-content':
				await this.reputationMessageContent(interaction);
				break;
			case 'reputation-give':
				await this.reputationGive(interaction);
				break;
			case 'reputation-remove':
				await this.reputationRemove(interaction);
				break;
			default:
				await interaction.reply({
					content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:invalid_subcommand')
				});
		}
	}

	private async view(interaction: Command.ChatInputCommandInteraction) {
		const config = await ServerConfigModel.GetServerConfig(interaction.guildId!);

		if (!config) {
			return await interaction.reply({
				content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:view.noConfig'),
				ephemeral: true
			});
		}

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:view.success', {
				replace: {
					language: config.language ?? 'en-US',
					reputation_enabled: config.reputation_enabled ? 'Enabled' : 'Disabled',
					reputation_gains: config.reputation_gains ?? 1,
					reputation_channel: this.container.utilities.format.channelMention(config.rank_up_channel) ?? 'None set',
					reputation_message_status: config.reputation_rank_up_message_enabled ? 'Enabled' : 'Disabled',
					reputation_message_content: config.reputation_rank_up_message ?? 'None set'
				}
			}),
			allowedMentions: {
				users: [],
				roles: []
			}
		});
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

	private async clear(interaction: Command.ChatInputCommandInteraction) {
		await ServerConfigModel.DeleteServerConfig(interaction.guildId!);

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:clear.success')
		});
	}

	private async reputationStatus(interaction: Command.ChatInputCommandInteraction) {
		const status = interaction.options.getString('status', true);

		await ServerConfigModel.UpdateServerConfig({
			guild_id: interaction.guildId!,
			reputation_enabled: status !== 'disabled',
			reputation_rank_up_message_enabled: true // this is added because when reputation is enabled, the message should be enabled by default but it does not unless the enabled command is ran? Need to fix later
		});

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:reputation.statusUpdated', {
				replace: {
					status: status === 'disabled' ? 'disabled' : 'enabled'
				}
			})
		});
	}

	private async reputationGains(interaction: Command.ChatInputCommandInteraction) {
		const amount = interaction.options.getInteger('amount', true);

		await ServerConfigModel.UpdateServerConfig({
			guild_id: interaction.guildId!,
			reputation_gains: amount
		});

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:reputation.gainsUpdated', {
				replace: {
					gains: amount
				}
			})
		});
	}

	private async reputationChannel(interaction: Command.ChatInputCommandInteraction) {
		const channel = interaction.options.getChannel('channel', true) as TextChannel;

		if (channel.type !== ChannelType.GuildText) {
			return await interaction.reply({
				content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:reputation.invalidChannelType'),
				ephemeral: true
			});
		}

		await ServerConfigModel.UpdateServerConfig({
			guild_id: interaction.guildId!,
			rank_up_channel: channel.id
		});

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:reputation.channelUpdated', {
				replace: {
					channel: this.container.utilities.format.channelMention(channel.id)
				}
			})
		});
	}

	private async reputationMessageStatus(interaction: Command.ChatInputCommandInteraction) {
		const status = interaction.options.getString('message-status', true);

		await ServerConfigModel.UpdateServerConfig({
			guild_id: interaction.guildId!,
			reputation_rank_up_message_enabled: status !== 'disabled'
		});

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:reputation.messageStatusUpdated')
		});
	}

	private async reputationMessageContent(interaction: Command.ChatInputCommandInteraction) {
		const message = interaction.options.getString('message-content', true);

		await ServerConfigModel.UpdateServerConfig({
			guild_id: interaction.guildId!,
			reputation_rank_up_message: message
		});

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:reputation.messageUpdated')
		});
	}

	private async reputationGive(interaction: Command.ChatInputCommandInteraction) {
		const user = interaction.options.getUser('reputation-user', true);
		const amount = interaction.options.getInteger('reputation-amount', true);

		const userReputation = await UserReputationModel.GetReputation(interaction.guildId!, user.id);

		if (!userReputation) {
			return await interaction.reply({
				content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:reputation.noRepInformation'),
				ephemeral: true
			});
		}

		await UserReputationModel.GiveReputation(interaction.guildId!, user.id, userReputation.reputation! + amount);

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:reputation.given', {
				replace: {
					user: this.container.utilities.format.userMention(user.id),
					amount: amount
				}
			})
		});
	}

	private async reputationRemove(interaction: Command.ChatInputCommandInteraction) {
		const user = interaction.options.getUser('reputation-user', true);
		const amount = interaction.options.getInteger('reputation-amount', true);

		const userReputation = await UserReputationModel.GetReputation(interaction.guildId!, user.id);

		if (!userReputation) {
			return await interaction.reply({
				content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:reputation.noRepInformation'),
				ephemeral: true
			});
		}

		const result = await UserReputationModel.UnsetReputation(interaction.guildId!, user.id, userReputation.reputation! - amount);

		return await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/serverconfig:reputation.removed', {
				replace: {
					user: this.container.utilities.format.userMention(user.id),
					amount: amount,
					newAmount: result.reputation
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
					.setDMPermission(false)
					.addSubcommand((subcommand) => {
						return subcommand.setName('view').setDescription('View the current server configuration');
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand.setName('clear').setDescription('Clear the current server configuration');
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
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
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName('reputation-status')
							.setDescription('Set the reputation status')
							.addStringOption((option) => {
								return option
									.setName('status')
									.setDescription('Whether reputation is enabled or disabled')
									.addChoices(...ReputationEnabledChoices)
									.setRequired(true);
							});
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName('reputation-gains')
							.setDescription('Set the amount of reputation gained per message')
							.addIntegerOption((option) => {
								return option
									.setName('amount')
									.setDescription('The amount of reputation gained per message')
									.setMinValue(1)
									.setMaxValue(1000)
									.setRequired(true);
							});
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName('reputation-channel')
							.setDescription('Set the channel where reputation rank-up messages are sent')
							.addChannelOption((option) => {
								return option
									.setName('channel')
									.setDescription('The channel where reputation rank-up messages are sent')
									.addChannelTypes(ChannelType.GuildText)
									.setRequired(true);
							});
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName('reputation-message-status')
							.setDescription('Set the reputation rank up message status')
							.addStringOption((option) => {
								return option
									.setName('message-status')
									.setDescription('Whether reputation rank-up message is enabled or disabled')
									.addChoices(...ReputationEnabledChoices)
									.setRequired(true);
							});
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName('reputation-message-content')
							.setDescription('Set the reputation rank up message content')
							.addStringOption((option) => {
								return option
									.setName('message-content')
									.setDescription('The content of the reputation rank-up message')
									.setRequired(true);
							});
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName(`reputation-give`)
							.setDescription(`Give reputation to someone`)
							.addUserOption((option) => {
								return option.setName(`reputation-user`).setDescription(`The user to give reputation to`).setRequired(true);
							})
							.addIntegerOption((option) => {
								return option
									.setName(`reputation-amount`)
									.setDescription(`The amount of reputation to remove`)
									.setRequired(true)
									.setMinValue(1)
									.setMaxValue(10000);
							});
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName(`reputation-remove`)
							.setDescription(`Give reputation to someone`)
							.addUserOption((option) => {
								return option.setName(`reputation-user`).setDescription(`The user to remove reputation to`).setRequired(true);
							})
							.addIntegerOption((option) => {
								return option
									.setName(`reputation-amount`)
									.setDescription(`The amount of reputation to remove`)
									.setRequired(true)
									.setMinValue(1)
									.setMaxValue(10000);
							});
					})
					.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
			{
				guildIds: getGuildIds(),
				registerCommandIfMissing: true,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: ['1076661073689710712']
			}
		);
	}
}
