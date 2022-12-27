import { readdirSync } from 'fs';
import { Collection, MessageFlags } from 'oceanic.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { client, db_obj } from './client.js';
import config, { isCanary } from './config/config.js';
import constants from './constants.js';
import mongoose from 'mongoose';
import { TagCommandPlugin } from './plugins/tag.js';
import { WelcomeCommandPlugin } from './plugins/welcome.js';
import { Utils } from './utils.js';
import { GoodbyeCommandPlugin } from './plugins/goodbye.js';
import { CooldownCommandPlugin } from './plugins/cooldown.js';
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
                goodbye: new GoodbyeCommandPlugin(this),
                cooldown: new CooldownCommandPlugin()
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
            if (!command.props.register)
                command.props.register = isCanary ? 'guild' : 'global';
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
        if (!interaction.guild)
            throw new Error('Guild not found');
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
                return interaction.createMessage({
                    content: constants.strings.events.interactionProcess.botPermissions,
                    flags: MessageFlags.EPHEMERAL
                });
            }
        }
        if (command?.requiredUserPermissions) {
            if (!interaction.member?.permissions.has(...command.requiredUserPermissions)) {
                return interaction.createMessage({
                    content: constants.strings.events.interactionProcess.userPermissions,
                    flags: MessageFlags.EPHEMERAL
                });
            }
        }
        // TODO - Add cool-down check
        if (command?.cooldown) {
            let manager = this.collections.commands.plugins.cooldown;
            if (manager.isOnCooldown(interaction.guild.id, interaction.user.id, command.trigger)) {
                return interaction.createMessage({
                    content: constants.strings.events.interactionProcess.isOnCooldown,
                    flags: MessageFlags.EPHEMERAL
                });
            }
            // If not on cooldown, add the user to the cooldown list
            manager.set(interaction.guild.id, interaction.user.id, command.trigger, {
                duration: command.cooldown.duration,
                multiplier: command.cooldown.multiplier
            });
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDakMsT0FBTyxFQUErQixVQUFVLEVBQXVELFlBQVksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN4SSxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUNwQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUU3QyxPQUFPLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sU0FBUyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZDLE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUNoQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzVELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTlELE1BQU0sQ0FBQyxPQUFPLE9BQU8sSUFBSTtJQUNqQixhQUFhLEdBQXNCLE1BQU0sQ0FBQztJQUVqQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBRWhDLGlDQUFpQztJQUMxQixRQUFRLEdBQUcsTUFBTSxDQUFDO0lBRWxCLElBQUksR0FBRztRQUNiLFdBQVcsRUFBRSxJQUFJLEdBQUcsQ0FBUyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQy9DLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBUyxNQUFNLENBQUMsV0FBVyxDQUFDO0tBQ2pELENB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