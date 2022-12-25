import mongoose from 'mongoose';
import { ActivityTypes, Client } from 'oceanic.js';
import config from './config/config.js';

/**
 * The Client Object for the bot by Oceanic.js
 *
 * This will not be mutated by us, and will only contain all native methods and properties from Oceanic.js
 *
 * The main manager class for the bot is found in Main.js and is called MainInstance.
 */
export const client = new Client({
	auth: `Bot ${config.BotToken}`,
	collectionLimits: {
		members: 1_000,
		messages: 10_000,
		users: 2_000
	},
	allowedMentions: {
		everyone: false,
		repliedUser: true,
		roles: false,
		users: false
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
		guildCreateTimeout: 2000,
		intents: ['GUILDS', 'GUILD_MEMBERS'],
		largeThreshold: 250,
		maxReconnectAttempts: Infinity,
		maxResumeAttempts: 10,
		maxShards: 1,
		presence: {
			activities: [{ type: ActivityTypes.WATCHING, name: 'The Chat Rooms' }],
			status: 'online'
		},
		seedVoiceConnections: false
	}
});

/** The data for the MainInstance DB object. */
export const db_obj = {
	network_status: () => fetchDBStatus(),
	managers: {}
};

export function fetchDBStatus(): boolean {
	return mongoose.connection.readyState === 1;
}
