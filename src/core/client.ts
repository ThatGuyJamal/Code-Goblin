import mongoose from 'mongoose';
import { Client } from 'oceanic.js';
import config from '../config/config.js';

/**
 * The Client Object for the bot by Oceanic.js
 *
 * This will not be mutated by us, and will only contain all native methods and properties from Oceanic.js
 *
 * The main manager class for the bot is found in Main.js and is called MainInstance.
 */
export const DiscordClient = new Client({
	auth: `Bot ${config.BotToken}`,
	collectionLimits: {
		members: 2_000,
		messages: 0,
		users: 1_000
	},
	allowedMentions: {
		everyone: false
	},
	defaultImageFormat: 'png',
	defaultImageSize: 4096,
	gateway: {
		autoReconnect: true,
		concurrency: 1,
		connectionProperties: {
			browser: 'Oceanic',
			device: 'Oceanic',
			os: 'Android'
		},
		connectionTimeout: 30000,
		firstShardID: 0,
		getAllUsers: false,
		guildCreateTimeout: 5000,
		intents: [
			'GUILDS',
			'GUILD_MEMBERS',
			'GUILD_MESSAGES',
			'MESSAGE_CONTENT',
			'GUILD_WEBHOOKS',
			'GUILD_EMOJIS_AND_STICKERS',
			'GUILD_SCHEDULED_EVENTS'
		],
		largeThreshold: 1000,
		maxReconnectAttempts: Infinity,
		maxResumeAttempts: 10,
		maxShards: 1,
		presence: {
			activities: [{ type: config.BotActivityType, name: config.BotActivityMessage }],
			status: 'online'
		},
		seedVoiceConnections: false
	}
});

/** The data for the MainInstance DB object. */
export const db_obj = {
	network_status: () => fetchDBStatus(),
	managers: {
		// tag: TagModel,
		// welcome: WelcomeModel,
		// goodbye: GoodbyeModel,
		// jam: CodeJamModel
	}
};

export function fetchDBStatus(): boolean {
	return mongoose.connection.readyState === 1;
}