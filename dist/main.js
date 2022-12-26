import { readdirSync } from 'fs';
import { Collection, MessageFlags } from 'oceanic.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { client, db_obj } from './client.js';
import config from './config/config.js';
import constants from './constants.js';
import mongoose from 'mongoose';
import { TagCommandPlugin } from './plugins/tag.js';
import { WelcomeCommandPlugin } from './plugins/welcome.js';
import { Utils } from './utils.js';
import { GoodbyeCommandPlugin } from './plugins/goodbye.js';
export default class Main {
    DiscordClient = client;
    config = config;
    /** Database Object Properties */
    database = db_obj;
    keys = {
        super_users: new Set(config.SuperUsers),
        helper_users: new Set(config.HelperUsers)
    };
    /** Common Collections used throughout the bot*/
    collections = {
        commands: {
            /** Used to store all commands */
            commandStoreMap: new Collection(),
            /** An array of all commands as Json Data for the discord api application commands */
            commandStoreArrayJsonGuild: [],
            commandStoreArrayJsonGlobal: [],
            plugins: {
                tags: new TagCommandPlugin(this),
                welcome: new WelcomeCommandPlugin(this),
                goodbye: new GoodbyeCommandPlugin(this)
            }
        }
    };
    utils = new Utils(this);
    /** Starts the core functionally of the bot. */
    async init() {
        await this.connectToDatabase();
        await this.DiscordClient.connect();
        console.log(`[INFO] Connecting to Discord API Gateway...`);
        await this.runEvents();
    }
    /** Loads and runs event modules for the bot */
    async runEvents() {
        this.DiscordClient.once('ready', (await import('./events/event_ready.js')).default.bind(null, this.DiscordClient))
            .on('interactionCreate', (await import('./events/event_interactionCreate.js')).default.bind(this))
            .on('guildCreate', (await import('./events/event_guildcreate.js')).default.bind(this.DiscordClient))
            .on('guildDelete', (await import('./events/event_guildleave.js')).default.bind(this.DiscordClient))
            .on('guildMemberAdd', (await import('./events/event_welcome.js')).default.bind(this))
            .on('guildMemberRemove', (await import('./events/event_goodbye.js')).default.bind(this))
            .on('messageCreate', (await import('./events/event_messageCreate.js')).default.bind(this))
            .on('error', (err) => {
            console.error(`[ERROR] Somethings broken...`, err);
        });
    }
    /** Loads the bot commands into the system cache */
    async loadCommands() {
        // Finds all command files in the modules folder
        const commandFiles = readdirSync(path.join(path.dirname(fileURLToPath(import.meta.url)), './commands')).filter((file) => file.endsWith('.js' || '.ts'));
        console.log(`[INFO] Loading ${commandFiles.length} commands...`);
        if (!commandFiles.length)
            return console.warn(`[WARN] No commands found to load.`);
        // Loops through all command files and loads them into the cache
        for (const file of commandFiles) {
            const command = (await import(`./commands/${file}`)).default;
            if (!command.props.nsfw)
                command.props.nsfw = false;
            if (!command.props.premiumOnly)
                command.props.premiumOnly = false;
            if (!command.props.superUserOnly)
                command.props.superUserOnly = false;
            if (!command.props.helperUserOnly)
                command.props.helperUserOnly = false;
            if (!command.props.disabled)
                command.props.disabled = false;
            // Filter out any commands that are disabled from being added to the application commands
            if (!command.props.disabled) {
                this.collections.commands.commandStoreMap.set(command.props.trigger, command.props);
                if (command.props.register === 'global') {
                    this.collections.commands.commandStoreArrayJsonGlobal.push(command.toJson());
                }
                else if (command.props.register === 'guild') {
                    this.collections.commands.commandStoreArrayJsonGuild.push(command.toJson());
                }
                else if (command.props.register === 'both') {
                    this.collections.commands.commandStoreArrayJsonGlobal.push(command.toJson());
                    this.collections.commands.commandStoreArrayJsonGuild.push(command.toJson());
                }
                console.log(`[COMMAND] Loaded ${command.props.trigger} into memory.`);
            }
            else {
                console.log(`[COMMAND] ${command.props.trigger} was not loaded into memory because it is disabled.`);
            }
        }
    }
    /**
     * Handles command interactions
     * @param interaction The interaction to handle
     */
    async processCommandInteraction(interaction) {
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
    async connectToDatabase() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDakMsT0FBTyxFQUErQixVQUFVLEVBQXVELFlBQVksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN4SSxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUNwQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUU3QyxPQUFPLE1BQU0sTUFBTSxvQkFBb0IsQ0FBQztBQUN4QyxPQUFPLFNBQVMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDcEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDNUQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUU1RCxNQUFNLENBQUMsT0FBTyxPQUFPLElBQUk7SUFDakIsYUFBYSxHQUFzQixNQUFNLENBQUM7SUFFakMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUVoQyxpQ0FBaUM7SUFDMUIsUUFBUSxHQUFHLE1BQU0sQ0FBQztJQUVsQixJQUFJLEdBQUc7UUFDYixXQUFXLEVBQUUsSUFBSSxHQUFHLENBQVMsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUMvQyxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQVMsTUFBTSxDQUFDLFdBQVcsQ0FBQztLQUNqRCxDQUFDO0lBRUYsZ0RBQWdEO0lBQ3pDLFdBQVcsR0FBRztRQUNwQixRQUFRLEVBQUU7WUFDVCxpQ0FBaUM7WUFDakMs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