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

import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-utilities-store/register';

import { Config, configValues, type IConfig } from './config';
import { MongodbDatabase } from './database/mongodb/db.js';
import { il8n as _il8n } from './utils/il8n';
import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits, Options } from 'discord.js';
import { config } from 'dotenv';

config();

/** Over-writes the default types for the Preconditions */
declare module '@sapphire/framework' {
	interface Preconditions {
		DevelopmentCommand: never;
		OwnerOnlyCommand: never;
		CommandCanRun: never;
	}
}

declare module '@sapphire/pieces' {
	interface Container {}
}

export class MainClass {
	config: IConfig;
	il8n: _il8n;
	database: {
		mongodb: MongodbDatabase;
	};
	discord: SapphireClient;

	public constructor() {
		this.config = new Config(configValues).data;
		this.database = {
			mongodb: new MongodbDatabase()
		};
		this.il8n = new _il8n();

		this.discord = new SapphireClient({
			shards: 'auto',
			shardCount: 1,
			loadDefaultErrorListeners: true,
			loadMessageCommandListeners: false,
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
			logger: {
				level: this.config.IsInDevelopmentMode ? LogLevel.Debug : LogLevel.Info
			},
			hmr: {
				enabled: this.config.IsInDevelopmentMode,
				silent: false
			},
			defaultCooldown: {
				// Ignored by Command Cooldown.
				filteredUsers: Array.from(this.config.SuperUsers)
			},
			i18n: this.il8n.parseInternationalizationOptions,
			makeCache: Options.cacheWithLimits({
				ApplicationCommandManager: {
					maxSize: 500
				}, // guild.commands
				BaseGuildEmojiManager: 0, // guild.emojis
				GuildBanManager: 0, // guild.bans
				GuildInviteManager: 0, // guild.invites
				GuildMemberManager: {
					maxSize: 1000
				}, // guild.members
				GuildStickerManager: 0, // guild.stickers
				GuildScheduledEventManager: 0, // guild.scheduledEvents
				MessageManager: {
					maxSize: 250
				}, // channel.messages
				PresenceManager: 0, // guild.presences
				ReactionManager: 0, // message.reactions
				ReactionUserManager: 0, // reaction.users
				StageInstanceManager: 0, // guild.stageInstances
				ThreadManager: 0,
				ThreadMemberManager: {
					maxSize: 0
				}, // thread-channel.members
				UserManager: {
					maxSize: 100
				}, // client.users
				VoiceStateManager: 0 // guild.voiceStates
			})
		});

		this.discord.login(this.config.BotToken).then(() => {});
	}
}

export const Main = new MainClass();

process
	.on('unhandledRejection', (err, promise) => {
		container.logger.error('Unhandled Rejection:', err, promise);
	})
	.on('uncaughtException', (err) => {
		container.logger.error('Uncaught Exception:', err);
	})
	.on('uncaughtExceptionMonitor', (err, origin) => {
		container.logger.error('Uncaught Exception Monitor:', err, origin);
	})
	.on('warning', (warning) => {
		container.logger.warn('Warning:', warning);
	})
	// .on('rejectionHandled', (promise) => {
	// 	container.logger.warn('Rejection Handled:', promise);
	// })
	// .on('multipleResolves', (type, promise, reason) => {
	// 	container.logger.warn('Multiple Resolves:', type, promise, reason);
	// })
	.on('exit', (code) => {
		container.logger.info('Exit:', code);
	});
