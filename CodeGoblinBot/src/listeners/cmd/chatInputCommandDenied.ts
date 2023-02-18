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

import { ChatInputCommandDeniedPayload, container, Events, Listener, LogLevel, UserError } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Listener.Options>({
	event: Events.ChatInputCommandDenied,
	enabled: container.logger.has(LogLevel.Debug)
})
export class UserListener extends Listener {
	public async run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		try {
			if (Reflect.get(Object(error.context), 'silent')) return;

			return await this.container.utilities.command.sendError(interaction, error.message);
		} catch (err) {
			return this.container.logger.error(err);
		}
	}
}
