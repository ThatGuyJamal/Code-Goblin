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

import { ChatInputCommandErrorPayload, container, Events, Listener, LogLevel, UserError } from '@sapphire/framework';
import { bold, redBright } from 'colorette';
import { ApplyOptions } from '@sapphire/decorators';
import { GlobalStatsModel } from '../../database/mongodb/models/statistics';

@ApplyOptions<Listener.Options>({
	event: Events.ChatInputCommandError,
	enabled: container.logger.has(LogLevel.Debug)
})
export class UserListener extends Listener {
	public async run(error: Error, { command, interaction }: ChatInputCommandErrorPayload) {
		try {
			await GlobalStatsModel.UpdateCommandsFailed();

			if (error instanceof UserError) {
				return this.container.utilities.command.sendError(interaction, error.message);
			}

			this.container.logger.fatal(`${redBright(bold(`[/${command.name}]`))} ${error.stack || error.message}`);

			return await this.container.utilities.command.sendError(
				interaction,
				`${command.name} has encountered an error. Please try again later.\n${error.message || error.stack || 'No error message'}`
			);
		} catch (err) {
			return this.container.logger.error(err);
		}
	}
}
