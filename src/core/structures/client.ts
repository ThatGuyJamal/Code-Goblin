import { Client, Guild, User } from 'oceanic.js';
import config from '../../config/config.js';
import type { Main } from '../index.js';

import type { CommandDataProp, LegacyCommand } from '../../typings/core/types.js';

import event_debug from '../events/event_debug.js';
import event_goodbye from '../events/event_goodbye.js';
import event_guildcreate from '../events/event_guildcreate.js';
import event_guildleave from '../events/event_guildleave.js';
import event_interactionCreate from '../events/event_interactionCreate.js';
import event_messageCreate from '../events/event_messageCreate.js';
import event_welcome from '../events/event_welcome.js';
import event_ready from '../events/event_ready.js';

export class DiscordClient extends Client {
	public instance: typeof Main;
	constructor(m: typeof Main) {
		super({
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
					browser: 'Code Goblin',
					device: 'Code Goblin',
					os: 'Linux'
				},
				connectionTimeout: 30000,
				firstShardID: 0,
				getAllUsers: false,
				guildCreateTimeout: 10000,
				intents: [
					'GUILDS',
					'GUILD_MEMBERS',
					'GUILD_MESSAGES',
					'MESSAGE_CONTENT',
					'GUILD_WEBHOOKS',
					'GUILD_EMOJIS_AND_STICKERS',
					'GUILD_SCHEDULED_EVENTS'
				],
				largeThreshold: 500,
				maxReconnectAttempts: Infinity,
				maxResumeAttempts: 10,
				maxShards: 1,
				presence: {
					activities: [{ type: config.BotActivityType, name: config.BotActivityMessage }],
					status: config.BotActivityStatus
				},
				seedVoiceConnections: false
			}
		});
		this.instance = m;
	}

	/** Starts the core functionally of the bot. */
	public async init(): Promise<void> {
		await this.connect();
		this.instance.logger.info(`Connecting to Discord API Gateway...`);
		await this.runEvents();
	}

	/** Loads and runs event modules for the bot */
	public async runEvents(): Promise<void> {
		const { logger } = this.instance;

		this.on('ready', async () => {
			await event_ready();
		})
			.on('interactionCreate', async (interaction) => {
				await event_interactionCreate(interaction);
			})
			.on('guildCreate', async (guild) => {
				await event_guildcreate(guild);
			})
			.on('guildDelete', async (guild) => {
				await event_guildleave(guild as Guild);
			})
			.on('guildMemberAdd', async (member) => {
				await event_welcome(member);
			})
			.on('guildMemberRemove', async (member, guild) => {
				if (member instanceof User) return;
				await event_goodbye(member, guild);
			})
			.on('messageCreate', async (message) => {
				await event_messageCreate(message);
			})
			.on('debug', (info) => {
				event_debug(this, info);
			})
			.on('error', (err) => {
				logger.error(err);
			});
	}

	/** Loads the bot commands into the system cache */
	public async loadCommands(): Promise<void> {
		this.instance.utils.addCommand((await import('../commands/ping.js')).default as CommandDataProp);
		this.instance.utils.addCommand((await import('../commands/automate.js')).default as CommandDataProp);
		this.instance.utils.addCommand((await import('../commands/embed.js')).default as CommandDataProp);
		this.instance.utils.addCommand((await import('../commands/info.js')).default as CommandDataProp);
		this.instance.utils.addCommand((await import('../commands/commands.js')).default as CommandDataProp);
		this.instance.utils.addCommand((await import('../plugins/tag/cmd.js')).default as CommandDataProp);
		this.instance.utils.addCommand((await import('../plugins/jam/cmd.js')).default as CommandDataProp);
		this.instance.utils.addLegacyCommand((await import('../commands/legacy/test_plugin.js')).default as LegacyCommand);
		this.instance.utils.addLegacyCommand((await import('../commands//legacy/commands.js')).default as LegacyCommand);
	}
}
