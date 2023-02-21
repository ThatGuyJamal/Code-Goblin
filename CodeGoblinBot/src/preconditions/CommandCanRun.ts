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

import { ChatInputCommand, Precondition } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { Main } from '..';

const devMode = Main.config.IsInDevelopmentMode;
const superUsers = Main.config.SuperUsers;

export class UserPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction, command: ChatInputCommand) {
		// Make sure the precondition is run on a guild.
		if (!interaction.guild) return this.ok();

		// Checks if the user is trying to use the production bot or not.
		if (devMode && !superUsers.has(interaction.user.id)) {
			return this.error({
				message: `Sorry but im in "canary" mode and only my developers can run this version of the bot.`
			});
		}

		// Checks if we are in maintenance mode.
		if (devMode && !superUsers.has(interaction.user.id)) {
			return this.error({
				message: `Sorry but the bot is currently under maintenance. Join our support server for more updates.`
			});
		}

		// Make sure the command is valid from the api.
		if (!command) return this.ok();

		// Make sure the command is enabled.
		// todo

		// return the success result.
		return this.ok();
	}
}
