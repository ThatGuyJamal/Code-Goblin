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
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { getGuildIds } from '../utils/utils';
import { Time } from '@sapphire/duration';
import { ExtendedCommand, ExtendedCommandOptions } from '../command';
import { ApplyOptions } from '@sapphire/decorators';
import type { TextChannel } from 'discord.js';
import ms from 'ms';
import { Main } from '../index';

@ApplyOptions<ExtendedCommandOptions>({
	name: 'ping',
	description: 'Checks the bots latency to the Discord API',
	cooldownDelay: Time.Second * 10,
	enabled: true
})
export class PingCommand extends ExtendedCommand {
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const msg = await interaction.reply({
			content: await this.t(interaction.channel as TextChannel, 'commands/general:ping_command.loading'),
			fetchReply: true
		});

		if (isMessageInstance(msg)) {
			const diff = ms(msg.createdTimestamp - interaction.createdTimestamp, { long: true });
			const ping = ms(this.container.client.ws.ping, { long: true });
			const uptime = ms(this.container.client.uptime ?? 0, { long: true });

			return await interaction.editReply({
				content: await this.t(interaction.channel as TextChannel, 'commands/general:ping_command.success', {
					replace: {
						ws: ping,
						rest: diff,
						health: uptime
					}
				})
			});
		}

		return interaction.editReply('Failed to retrieve ping :(');
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description).setDMPermission(true), {
			guildIds: getGuildIds(),
			registerCommandIfMissing: Main.config.commands.register,
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			idHints: ['1075585193110409338']
		});
	}
}
