import mongoose from 'mongoose';
import { Client as DiscordClientType, Collection, CreateApplicationCommandOptions, CommandInteraction, MessageFlags } from 'oceanic.js';

import { Utils } from './utils.js';
import constants from './constants.js';
import { client, db_obj } from './client/client.js';
import config from './config/config.js';
import type { Command, CommandDataProp } from './command.js';

import { TagCommandPlugin } from './plugins/tag/index.js';
import { WelcomeCommandPlugin } from './plugins/welcome/index.js';
import { GoodbyeCommandPlugin } from './plugins/goodbye/index.js';
import { CodeJamCommandPlugin } from './plugins/jam/index.js';
import { logger } from './index.js';

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
		this.DiscordClient.once('ready', (await import('./events/event_ready.js')).default.bind(null, this.DiscordClient))
			.on('interactionCreate', (await import('./events/event_interactionCreate.js')).default.bind(this))
			.on('guildCreate', (await import('./events/event_guildcreate.js')).default.bind(this.DiscordClient))
			.on('guildDelete', (await import('./events/event_guildleave.js')).default.bind(this.DiscordClient) as any)
			.on('guildMemberAdd', (await import('./events/event_welcome.js')).default.bind(this))
			.on('guildMemberRemove', (await import('./events/event_goodbye.js')).default.bind(this) as any)
			.on('messageCreate', (await import('./events/event_messageCreate.js')).default.bind(this))
			.on('debug', (await import('./events/event_debug.js')).default.bind(this.DiscordClient))
			.on('error', (err) => {
				logger.error(`Somethings broken...`, err);
			});
	}

	/** Loads the bot commands into the system cache */
	public async loadCommands(): Promise<void> {
		this.utils.addCommand((await import('./commands/commands.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./commands/embed.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./commands/information.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./plugins/goodbye/cmd.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./plugins/tag/cmd.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./plugins/welcome/cmd.js')).default as CommandDataProp);
		this.utils.addCommand((await import('./plugins/jam/cmd.js')).default as CommandDataProp);
	}

	/**
	 * Handles command interactions
	 * @param interaction The interaction to handle
	 */
	public async processCommandInteraction(interaction: CommandInteraction): Promise<void> {
		if (!interaction.guild) throw new Error('Guild not found');

		const command = this.collections.commands.commandStoreMap.get(interaction.data.name);

		if (command?.disabled && !this.keys.super_users.has(interaction.user.id)) {
			return interaction.createMessage({ content: constants.strings.events.interactionProcess.commandDisabled, flags: MessageFlags.EPHEMERAL });
		}

		if (command?.superUserOnly && !this.keys.super_users.has(interaction.user.id)) {
			return interaction.createMessage({ content: constants.strings.events.interactionProcess.superUsersOnly, flags: MessageFlags.EPHEMERAL });
		}

		if (command?.helperUserOnly && !this.keys.helper_users.has(interaction.user.id) && !this.keys.super_users.has(interaction.user.id)) {
			return interaction.createMessage({ content: constants.strings.events.interactionProcess.helpersOnly, flags: MessageFlags.EPHEMERAL });
		}

		if (command?.requiredBotPermissions) {
			if (!interaction.appPermissions?.has(...command.requiredBotPermissions)) {
				return await interaction.createMessage({
					content: `I need the following permissions: \`${command.requiredBotPermissions}\` to execute this command.`,
					flags: MessageFlags.EPHEMERAL
				});
			}
		}

		if (command?.requiredUserPermissions) {
			if (!interaction.member?.permissions.has(...command.requiredUserPermissions)) {
				return await interaction.createMessage({
					content: `You need the following permissions: \`${command.requiredUserPermissions}\` to execute this command.`,
					flags: MessageFlags.EPHEMERAL
				});
			}
		}

		await (command
			? command.run.call(this, this, interaction)
			: interaction.createMessage({ content: "I couldn't figure out how to execute that command.", flags: MessageFlags.EPHEMERAL }));
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
