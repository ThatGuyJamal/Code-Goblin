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
import { Listener, container, LogLevel, Events, ChatInputCommandSuccessPayload } from '@sapphire/framework';
import { bold, cyan } from 'colorette';
import { GlobalStatsModel } from '../../database/mongodb/models/statistics';

@ApplyOptions<Listener.Options>({
	event: Events.ChatInputCommandSuccess,
	enabled: container.logger.has(LogLevel.Debug)
})
export class UserListener extends Listener {
	public override async run(payload: ChatInputCommandSuccessPayload) {
		const author = payload.interaction.user;
		const message = `${cyan(bold(`[/${payload.command.name}]`))} - Command executed by ${author.tag} (${author.id})`;

		this.container.logger.debug(message);

		await GlobalStatsModel.UpdateCommandsExecuted();
	}
}
