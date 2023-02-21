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

import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, CacheType } from 'discord.js';
import { Main } from '..';

export class UserPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction<CacheType>) {
		return Main.config.SuperUsers.has(interaction.user.id)
			? this.ok()
			: this.error({
					message: 'This command is currently in active development. Please try again later or join our support server for questions.'
			  });
	}
}
