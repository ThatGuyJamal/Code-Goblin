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
import type { GuildMember, TextChannel } from 'discord.js';
import { WelcomeModel } from '../../database/mongodb/models/welcome';
import { Main } from '../../index';

type WelcomeDataReturnType = {
	welcomeChannel: TextChannel;
	welcomeMessage: string;
};

@ApplyOptions<ListenerOptions>({
	event: Events.GuildMemberAdd
})
export class UserEvent extends Listener {
	public async run(member: GuildMember) {
		const result = await this.fetchWelcomeData(member);

		if (!result) return;

		const { welcomeChannel, welcomeMessage } = result;

		await welcomeChannel
			.send({
				content: welcomeMessage,
				allowedMentions: {
					parse: ['users', 'roles']
				}
			})
			.catch(() => {});
	}

	private async fetchWelcomeData(member: GuildMember): Promise<WelcomeDataReturnType | null> {
		const { guild } = member;

		if (!guild) return null;

		const data = await WelcomeModel.GetWelcome(guild.id);

		if (!data || !data.enabled || !data.channel_id || !data?.content) return null;

		const welcomeChannel = guild.channels.cache.get(data.channel_id) as TextChannel;

		if (!welcomeChannel) return null;

		const welcomeMessage = Main.utils.FormatPluginStringData(member, data.content);

		return { welcomeChannel, welcomeMessage };
	}
}
