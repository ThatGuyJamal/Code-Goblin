import type { Collection } from "oceanic.js";
import type { CreateApplicationCommandOptions } from "oceanic.js";
import type { Command } from "../../core/structures/command";

export interface MainCollections {
	/** A Collection of all command information and data */
	commands: MainCollectionCommands;
}

interface MainCollectionCommands {
	/** Used to store all commands */
	commandStoreMap: Collection<string, Command>;
	/** An array of all commands as Json Data for the discord api guild application commands */
	commandStoreArrayJsonGuild: CreateApplicationCommandOptions[];
	/** An array of all commands as Json Data for the discord api global application commands */
	commandStoreArrayJsonGlobal: CreateApplicationCommandOptions[];
	plugins: MainCollectionCommandsPlugins;
}

interface MainCollectionCommandsPlugins {
    // tags: TagCommandPlugin;
    // welcome: WelcomeCommandPlugin;
    // goodbye: GoodbyeCommandPlugin;
    // jam: CodeJamCommandPlugin;
}