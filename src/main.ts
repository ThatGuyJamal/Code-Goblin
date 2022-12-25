import { readdirSync } from 'fs';
import { Client as DiscordClientType, Collection, CreateApplicationCommandOptions, CommandInteraction, MessageFlags } from 'oceanic.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { client, db_obj } from './client.js';
import type { Command, CommandDataProp } from './command.js';
import config from './config/config.js';
import constants from './constants.js';

export default class Main {
	public DiscordClient: DiscordClientType = client;

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
			commandStoreArrayJson: [] as CreateApplicationCommandOptions[]
		}
	};

	/** Starts the core functionally of the bot. */
	public async init(): Promise<void> {
		await this.DiscordClient.connect();
		console.log(`[INFO] Connecting to Discord API Gateway...`);
		await this.runEvents();
	}

	/** Loads and runs event modules for the bot */
	public async runEvents(): Promise<void> {
		this.DiscordClient.once('ready', (await import('./events/event_ready.js')).default.bind(null, client))
			.on('interactionCreate', (await import('./events/event_interactionCreate.js')).default.bind(this))
			.on('guildCreate', (await import('./events/event_guildcreate.js')).default.bind(client))
			.on('guildDelete', (await import('./events/event_guildleave.js')).default.bind(client) as any)
			.on('error', (err) => {
				console.error(`[ERROR] Somethings broken...`, err);
			});
	}

	/** Loads the bot commands into the system cache */
	public async loadCommands(): Promise<void> {
		// Finds all command files in the modules folder
		const commandFiles: string[] = readdirSync(path.join(path.dirname(fileURLToPath(import.meta.url)), './commands')).filter((file) =>
			file.endsWith('.js' || '.ts')
		);

		console.log(`[INFO] Loading ${commandFiles.length} commands...`);

		if (!commandFiles.length) return console.warn(`[WARN] No commands found to load.`);

		// Loops through all command files and loads them into the cache
		for (const file of commandFiles) {
			const command = (await import(`./commands/${file}`)).default as CommandDataProp;

			if (!command.props.nsfw) command.props.nsfw = false;
			if (!command.props.premiumOnly) command.props.premiumOnly = false;
			if (!command.props.superUserOnly) command.props.superUserOnly = false;
			if (!command.props.helperUserOnly) command.props.helperUserOnly = false;
			if (!command.props.disabled) command.props.disabled = false;

			// Filter out any commands that are disabled from being added to the application commands
			if (!command.props.disabled) {
				this.collections.commands.commandStoreMap.set(command.props.trigger, command.props);
				this.collections.commands.commandStoreArrayJson.push(command.toJson());
				console.log(`[COMMAND] Loaded ${command.props.trigger} into memory.`);
			} else {
				console.log(`[COMMAND] ${command.props.trigger} was not loaded into memory because it is disabled.`);
			}
		}
	}

	/**
	 * Handles command interactions
	 * @param interaction The interaction to handle
	 */
	public async processCommandInteraction(interaction: CommandInteraction): Promise<void> {
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

		// if (command?.premiumOnly && !this.database.managers.user_premium.isPremium(interaction.user.id)) {
		// 	return interaction.createMessage({ content: constants.strings.events.interactionProcess.premiumOnly, flags: MessageFlags.EPHEMERAL });
		// }

		// TODO - Add cooldown check

		// TODO - Add permission check

		await (command
			? command.run.call(this, this, interaction)
			: interaction.createMessage({ content: "I couldn't figure out how to execute that command.", flags: MessageFlags.EPHEMERAL }));
	}
}

export const MainInstance = new Main();
