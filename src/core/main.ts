import { Client, Collection } from "oceanic.js";
import type { MainCollections } from "../typings/core/main.js";
import { Utils } from "../utils/index.js";
import { DiscordClient } from "./client.js";

export default class Main {
	public utils: Utils;
	public DiscordClient: Client;
	/** Common Collections used throughout the bot*/
	public collections: MainCollections = {
		commands: {
			commandStoreMap: new Collection(),
			commandStoreArrayJsonGuild: [],
			commandStoreArrayJsonGlobal: [],
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