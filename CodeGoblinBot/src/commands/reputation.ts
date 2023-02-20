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
import { UserReputationModel } from '../database/mongodb/models/reputation';
import type { TextChannel } from 'discord.js';
import { BrandingColors } from '../utils/constants';

@ApplyOptions<ExtendedCommandOptions>({
	name: 'reputation',
	description: 'Reputation plugin',
	cooldownDelay: Time.Second * 10,
	enabled: true
})
export class NewCommand extends ExtendedCommand {
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === 'view') {
			let user = interaction.options.getUser('user');
			if (!user) user = interaction.user;

			const rep = await UserReputationModel.GetReputation(interaction.guildId!, user.id);

			if (!rep) {
				return await interaction.reply({
					content: await this.t(interaction.channel as TextChannel, 'commands/plugin:reputation.noReputation', {
						replace: {
							user: user.tag
						}
					}),
					ephemeral: true
				});
			}

			return await interaction.reply({
				content: await this.t(interaction.channel as TextChannel, 'commands/plugin:reputation.view', {
					replace: {
						user: user.tag,
						reputation: rep.reputation
					}
				})
			});
		}
		if (subcommand === 'leaderboard') {
			const rawLb = await UserReputationModel.GetReputationLeaderboard(interaction.guildId!); // defaults to getting top 10 users in the leaderboard

			if (!rawLb || rawLb.reputation_leaderboard.length <= 0) {
				return await interaction.reply({
					content: await this.t(interaction.channel as TextChannel, 'commands/plugin:reputation.noData'),
					ephemeral: true
				});
			}

			const leaderboard = await UserReputationModel.ComputeReputationLeaderboard(this.container.client, rawLb.reputation_leaderboard, true);

			const lb = leaderboard.map((e) => `${e.position}. ${e.tag}\nRank: ${e.reputation_rank}\nRep: ${e.reputation!.toLocaleString()}`);

			return await interaction.reply({
				content: await this.t(interaction.channel as TextChannel, 'commands/plugin:reputation.leaderboard', {
					replace: {
						server: interaction.guild!.name
					}
				}),
				embeds: [
					{
						description: lb.join('\n\n'),
						color: BrandingColors.Primary,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		return interaction.reply('Oh no...');
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((subcommand) => {
						return subcommand
							.setName(`view`)
							.setDescription(`View your reputation or someone else's reputation`)
							.addUserOption((option) =>
								option.setName(`user`).setDescription(`The user to view the reputation of`).setRequired(false)
							);
					})
					.addSubcommand((subcommand) => {
						return subcommand.setName(`leaderboard`).setDescription(`View the reputation leaderboard`);
					}),

			{
				guildIds: getGuildIds(),
				registerCommandIfMissing: true,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: ['1077041571989557249']
			}
		);
	}
}
