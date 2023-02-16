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
import { ListenerOptions, Events, Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { Main } from '..';

@ApplyOptions<ListenerOptions>({
	event: Events.MentionPrefixOnly
})
export class UserEvent extends Listener {
	public async run(ctx: Message) {
		let _prefix = this.container.client.fetchPrefix(ctx);

		if (!Main.utils.isPrivateMessage(ctx)) {
			await ctx.reply({
				content: `My prefix in this server is \`${_prefix}\``
			});
		} else {
			await ctx.reply({
				content: "I don't have a prefix in the dms!"
			});
		}
	}
}
