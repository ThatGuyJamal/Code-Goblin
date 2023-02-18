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

import { config } from 'dotenv';

config();

export const configValues = {
	BotToken: process.env.DISCORD_BOT_TOKEN!,
	DevelopmentGuildId: process.env.DISCORD_BOT_DEV_GUILD!,
	IsInDevelopmentMode: true,
	MONGODB_URI: process.env.MONGODB_URI!,
	BotPrefix: process.env.DISCORD_BOT_PREFIX!,
	OpenAPIkey: process.env.DISCORD_OPENAI_API_KEY!,

	commands: {
		delete: false
	},
	BotErrorLogChannelId: '1056339397194297384',
	BotApiLogChannelId: '1056292297756639342',
	BotPremiumLogChannelId: '1064732671399432202',
	BotJoinLeaveLogChannelId: '1006242588535296062',
	BotGitHubRepo: 'https://github.com/ThatGuyJamal/Code-Goblin',
	BotSupportServerInvite: 'https://discord.gg/MSTrBrNaGn',
	BotOauthInviteLong:
		'https://discord.com/oauth2/authorize?client_id=1055671501870874634&permissions=148981992464&scope=applications.commands%20bot',
	BotOauthInviteShort: 'http://bit.ly/3Wvqk5u',
	SuperUsers: new Set(['370637638820036608'])
};

export type IConfig = typeof configValues;

export class Config {
	public constructor(config: IConfig) {
		Config.validateObject(config);
	}

	public get data(): IConfig {
		return configValues;
	}

	/**
	 * Validates the properties of the config object.
	 * @param obj
	 */
	private static validateObject(obj: Object) {
		for (const [key, value] of Object.entries(obj)) {
			if (value === undefined || value === null) {
				throw new Error(`The environment variable ${key} is not set in the .env file.`);
			}
		}
	}
}
