import mongoose from 'mongoose';
import { Client as DiscordClientType, Collection, CreateApplicationCommandOptions, Guild, User } from 'oceanic.js';

import { Utils } from './utils.js';
import { client, db_obj } from './client/client.js';
import config from './config/config.js';
import type { Command, CommandDataProp } from './command.js';

import { TagCommandPlugin } from './plugins/tag/plugin.js';
import { WelcomeCommandPlugin } from './plugins/welcome/plugin.js';
import { GoodbyeCommandPlugin } from './plugins/goodbye/plugin.js';
import { CodeJamCommandPlugin } from './plugins/jam/plugin.js';
import { logger } from './index.js';

import event_ready from './events/event_ready.js';
import event_guildcreate from './events/event_guildcreate.js';
import event_guildleave from './events/event_guildleave.js';
import event_interactionCreate from './events/event_interactionCreate.js';
import event_messageCreate from './events/event_messageCreate.js';
import event_goodbye from './events/event_goodbye.js';
import event_welcome from './events/event_welcome.js';
import event_debug from './events/event_debug.js';

export default class Main {
	public DiscordClient: DiscordClientType = client;

	/** The config file */
	public readonly config = config;

	/** Database Object Properties */
	public database = db_obj;

	public keys = {
		super_users: new Set<string>(config.SuperUsers),
		helper_users: new Set<string>(config.HelperUsers)
	};

	/** Common Collections used throughout the bot*/
	public collections = {
		commands: {
			/** Used to store all commands */
			commandStoreMap: new Collection<string, Command>(),
			/** An array of all commands as Json Data for the discord api application commands */
			commandStoreArrayJsonGuild: [] as CreateApplicationCommandOptions[],
			commandStoreArrayJsonGlobal: [] as CreateApplicationCommandOptions[],
			plugins: {
				tags: new TagCommandPlugin(this),
				welcome: new WelcomeCommandPlugin(this),
				goodbye: new GoodbyeCommandPlugin(this),
				jam: new CodeJamCommandPlugin(this)
			}
		}
	};

	public utils = new Utils(this);

	/** Starts the core functionally of the bot. */
	public async init(): Promise<void> {
		await this.connectToDatabase();
		await this.DiscordClient.connect();
		logger.info(`Connecting to Discord API Gateway...`);
		await this.runEvents();
	}

	/** Loads and runs event modules for the bot */
	public async runEvents(): Promise<void> {
		this.DiscordClient.on('ready', async () => {
			await event_ready(this.DiscordClient);
		})
			.on('interactionCreate', async (interaction) => {
				await event_interactionCreate(this, interaction);
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
				event_debug(this.DiscordClient, info);
			})
			.on('error', (err) => {
				logger.error(err);
			});
	}

	/** Loads the bot commands into the system cache */
	public async loadCommands(): Promise<void> {
		this.utils.addCommand((await import('./commands/commands.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./commands/embed.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./commands/information.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./plugins/tag/cmd.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./plugins/jam/cmd.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./plugins/automate/cmd.js')).default as CommandDataProp);
	}

	public async connectToDatabase() {
		await mongoose
			.connect(config.MongoDbUri)
			.then(() => {
				logger.info(`Connected to MongoDB`);
			})
			.catch((err) => {
				logger.error(`Failed to connect to MongoDB`, err);
			});
	}
}

export const MainInstance = new Main();
