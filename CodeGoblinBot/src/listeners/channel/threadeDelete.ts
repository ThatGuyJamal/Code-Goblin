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
import type { ThreadChannel } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	event: Events.ThreadCreate
})
export class UserEvent extends Listener {
	public async run(thread: ThreadChannel) {
		const { logger } = this.container;
		if (thread.joined) {
			const left = await thread.leave().catch(() => null);
			if (left) logger.debug(`Left thread: ${left.name} (${left.id})`);
		} else {
			logger.debug('I am not in this thread');
		}
	}
}
