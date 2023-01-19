import type { Collection } from "oceanic.js";
import type { CreateApplicationCommandOptions } from "oceanic.js";
import type { Command } from "../../core/structures/command";

export interface MainCollections {
    commands: {
        commandStoreMap: Collection<string, Command>;
        commandStoreArrayJsonGuild: CreateApplicationCommandOptions[];
        commandStoreArrayJsonGlobal: CreateApplicationCommandOptions[];
        plugins: {
            // tags: TagCommandPlugin;
            // welcome: WelcomeCommandPlugin;
            // goodbye: GoodbyeCommandPlugin;
            // jam: CodeJamCommandPlugin;
        }
    }
}