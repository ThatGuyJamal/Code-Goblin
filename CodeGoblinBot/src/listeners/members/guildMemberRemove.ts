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
import { GoodbyeModel } from '../../database/mongodb/models/goodbye';

type GoodbyeDataReturnType = {
	goodbyeChannel: TextChannel;
	goodbyeMessage: string;
};

@ApplyOptions<ListenerOptions>({
	event: Events.GuildMemberRemove
})
export class UserEvent extends Listener {
	public async run(member: GuildMember) {
		const result = await this.fetchGoodbyeData(member);

		if (!result) return;

		const { goodbyeChannel, goodbyeMessage } = result;

		await goodbyeChannel
			.send({
				content: goodbyeMessage,
				allowedMentions: {
					parse: ['users', 'roles']
				}
			})
			.catch(() => {});
	}

	private async fetchGoodbyeData(member: GuildMember): Promise<GoodbyeDataReturnType | null> {
		const { guild } = member;

		if (!guild) return null;

		const data = await GoodbyeModel.GetGoodbye(guild.id);

		if (!data || !data.enabled || !data.channel_id || !data?.content) return null;

		const goodbyeChannel = guild.channels.cache.get(data.channel_id) as TextChannel;

		if (!goodbyeChannel) return null;

		const goodbyeMessage = this.container.utilities.format.FormatPluginStringData(member, data.content);

		return { goodbyeChannel, goodbyeMessage };
	}
}
