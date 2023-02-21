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
import type { Message, TextChannel } from 'discord.js';
import { UserReputationModel } from '../../database/mongodb/models/reputation';
import { ServerConfigDefaults, ServerConfigModel } from '../../database/mongodb/models/config';
import { resolveKey } from '@sapphire/plugin-i18next';

@ApplyOptions<ListenerOptions>({
	event: Events.MessageCreate
})
export class UserEvent extends Listener {
	public async run(message: Message) {
		if (!message.guild) return;
		if (message.author.bot) return;

		const { guild, author } = message;

		const config = await ServerConfigModel.GetServerConfig(guild.id);

		if (!config || !config.reputation_enabled) return;

		const user = await UserReputationModel.ProcessReputation(
			guild.id,
			author.id,
			config.reputation_gains! ?? ServerConfigDefaults.REPUTATION_GAINS
		);

		// if the user ranks up, send a message, otherwise do nothing
		if (user.rankUp) {
			if (!config.reputation_rank_up_message_enabled) return;

			const userData = await UserReputationModel.GetReputation(guild.id, author.id);

			if (!userData) return; // this should not happen but for type safety

			const rankUpMessageValue = config.reputation_rank_up_message
				? this.container.utilities.format.FormatPluginStringData(message.member!, config.reputation_rank_up_message)
				: null;

			const rankUpChannel = guild.channels.cache.get(config.rank_up_channel!) as TextChannel;
			// If the rank up message is not set, use the default message
			const rankUpMessage =
				rankUpMessageValue ??
				((await resolveKey(message.channel as TextChannel, 'events/plugins:reputation.rankUpMessage', {
					replace: {
						author: this.container.utilities.format.userMention(author.id),
						rank: userData.reputation_rank
					}
				}).then((res) => res)) as string);

			if (rankUpChannel) {
				await rankUpChannel
					.send({
						content: rankUpMessage
					})
					.catch(() => {});
			} else {
				await message
					.reply({
						content: rankUpMessage
					})
					.catch(() => {});
			}
		}
	}
}
