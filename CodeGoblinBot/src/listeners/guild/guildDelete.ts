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
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { Guild } from 'discord.js';
import { GlobalStatsModel } from '../../database/mongodb/models/statistics';
import { Main } from '../../index';

@ApplyOptions<ListenerOptions>({
	event: Events.GuildDelete
})
export class UserEvent extends Listener {
	public async run(guild: Guild) {
		const { client } = this.container;

		try {
			let msg = `❌ ${client.user?.username} has been removed from \`${guild.name} | id:(${guild.id})\` **Now in** \`${client.guilds.cache.size} servers.\``;

			await Main.utils.sendToLogChannel(guild.client, 'join-leave', msg, true);

			await GlobalStatsModel.UpdateGuildsLeft();
		} catch (error) {
			this.container.client.logger.error(error);
		}
	}
}
