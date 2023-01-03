import path from 'path';
import mongoose from 'mongoose';
import { readdirSync } from 'fs';
import { Client as DiscordClientType, Collection, CreateApplicationCommandOptions, CommandInteraction, MessageFlags } from 'oceanic.js';
import { fileURLToPath } from 'url';

import { Utils } from './utils/utils.js';
import constants from './utils/constants.js';
import { client, db_obj } from './client/client.js';
import config, { isCanary } from './config/config.js';
import type { Command, CommandDataProp } from './cmd/command.js';

import { TagCommandPlugin } from './plugins/tag.js';
import { WelcomeCommandPlugin } from './plugins/welcome.js';
import { GoodbyeCommandPlugin } from './plugins/goodbye.js';
import { CooldownCommandPlugin } from './plugins/cooldown.js';

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
				cooldown: new CooldownCommandPlugin()
			}
		}
	};

	public utils = new Utils(this);

	/** Starts the core functionally of the bot. */
	public async init(): Promise<void> {
		await this.connectToDatabase();
		await this.DiscordClient.connect();
		console.log(`[INFO] Connecting to Discord API Gateway...`);
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
				console.error(`[ERROR] Somethings broken...`, err);
			});
	}

	/** Loads the bot commands into the system cache */
	public async loadCommands(): Promise<void> {
		// Finds all command files in the modules folder
		const commandFiles: string[] = readdirSync(path.join(path.dirname(fileURLToPath(import.meta.url)), './commands')).filter((file) =>
			file.endsWith('.js' || '.ts')
		)

		console.log(`[INFO] Loading ${commandFiles.length} commands...`);

		if (!commandFiles.length) return console.warn(`[WARN] No commands found to load.`);

		// Loops through all command files and loads them into the cache
		for (const file of commandFiles) {
			try {
				const command = (await import(`./commands/${file}`)).default as CommandDataProp;

			if (!command.props.nsfw) command.props.nsfw = false;
			if (!command.props.premiumOnly) command.props.premiumOnly = false;
			if (!command.props.superUserOnly) command.props.superUserOnly = false;
			if (!command.props.helperUserOnly) command.props.helperUserOnly = false;
			if (!command.props.disabled) command.props.disabled = false;
			if (!command.props.register) command.props.register = isCanary ? 'guild' : 'global';

			// Filter out any commands that are disabled from being added to the application commands
			if (!command.props.disabled) {
				this.collections.commands.commandStoreMap.set(command.props.trigger, command.props);

				if (command.props.register === 'global') {
					this.collections.commands.commandStoreArrayJsonGlobal.push(command.toJson());
				} else if (command.props.register === 'guild') {
					this.collections.commands.commandStoreArrayJsonGuild.push(command.toJson());
				} else if (command.props.register === 'both') {
					this.collections.commands.commandStoreArrayJsonGlobal.push(command.toJson());
					this.collections.commands.commandStoreArrayJsonGuild.push(command.toJson());
				}

				console.log(`[COMMAND] Loaded ${command.props.trigger} into memory.`);
			} else {
				console.log(`[COMMAND] ${command.props.trigger} was not loaded into memory because it is disabled.`);
			}
			} catch (err) {
				console.error(`[ERROR] Failed to load command ${file} into memory.`, err);
			}
		}
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

		// TODO - Add cool-down check

		await (command
			? command.run.call(this, this, interaction)
			: interaction.createMessage({ content: "I couldn't figure out how to execute that command.", flags: MessageFlags.EPHEMERAL }));
	}

	public async connectToDatabase() {
		await mongoose
			.connect(config.MongoDbUri)
			.then(() => {
				console.log(`[INFO] Connected to MongoDB`);
			})
			.catch((err) => {
				console.error(`[ERROR] Failed to connect to MongoDB`, err);
			});
	}
}

export const MainInstance = new Main();
