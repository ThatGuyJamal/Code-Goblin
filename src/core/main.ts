import { Client, Collection, CreateApplicationCommandOptions } from "oceanic.js";
import type { MainCollections } from "../typings/core/main.js";
import { Utils } from "../utils/index.js";
import { DiscordClient } from "./client.js";
import type { Command } from "./structures/command.js";

export default class Main {
	public utils: Utils;
	public DiscordClient: Client;
	/** Common Collections used throughout the bot*/
	public collections: MainCollections = {
		commands: {
			/** Used to store all commands */
			commandStoreMap: new Collection<string, Command>(),
			/** An array of all commands as Json Data for the discord api application commands */
			commandStoreArrayJsonGuild: [] as CreateApplicationCommandOptions[],
			commandStoreArrayJsonGlobal: [] as CreateApplicationCommandOptions[],
			plugins: {
				// tags: new TagCommandPlugin(this),
				// welcome: new WelcomeCommandPlugin(this),
				// goodbye: new GoodbyeCommandPlugin(this),
				// jam: new CodeJamCommandPlugin(this)
			}
		}
	};

	constructor() {
		this.utils = new Utils(this);
		this.DiscordClient = DiscordClient;
	}
}