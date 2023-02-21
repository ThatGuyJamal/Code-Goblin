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
import { Events, Listener, ListenerErrorPayload, ListenerOptions } from '@sapphire/framework';
import { bold, redBright } from 'colorette';

@ApplyOptions<ListenerOptions>({
	event: Events.ListenerError
})
export class UserEvent extends Listener {
	public async run(error: Error, payload: ListenerErrorPayload): Promise<void> {
		this.container.logger.error(error, payload);
	}
}

@ApplyOptions<ListenerOptions>({
	event: Events.Error
})
export class UserEvent2 extends Listener {
	public async run(error: Error, payload: ListenerErrorPayload): Promise<void> {
		this.container.logger.error(error, payload);
	}
}

export class UserEvent3 extends Listener<typeof Events.ListenerError> {
	public run(error: Error, { piece }: ListenerErrorPayload) {
		this.container.logger.fatal(`${redBright(bold(`[/${piece.name}]`))} ${error.stack || error.message}`);
	}
}
