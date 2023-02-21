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

import { Utility } from '@sapphire/plugin-utilities-store';
import { APIMessage, Message } from 'discord.js';
import type { DMMessage, GuildMessage } from '../utils/types';

declare module '@sapphire/plugin-utilities-store' {
	export interface Utilities {
		validate: ValidateUtility;
	}
}

export class ValidateUtility extends Utility {
	public constructor(context: Utility.Context, options: Utility.Options) {
		super(context, {
			...options,
			name: 'validate'
		});
	}

	public validateDate(date: string) {
		const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
		return dateRegex.test(date);
	}

	/**
	 * Checks whether a message was sent in a guild.
	 * @param message The message to check.
	 * @returns Whether the message was sent in a guild.
	 */
	public isGuildMessage(message: Message): message is GuildMessage {
		return message.guild !== null;
	}

	/**
	 * Checks whether a message was sent in a DM channel.
	 * @param message The message to check.
	 * @returns Whether the message was sent in a DM channel.
	 */
	public isPrivateMessage(message: Message): message is DMMessage {
		return message.guild === null;
	}

	/**
	 * Checks whether a given message is an instance of {@link Message}, and not {@link APIMessage}
	 * @param message The message to check
	 * @returns `true` if the message is an instance of `Message`, false otherwise.
	 */
	public isMessageInstance(message: APIMessage | Message): message is Message {
		return message instanceof Message;
	}
}
