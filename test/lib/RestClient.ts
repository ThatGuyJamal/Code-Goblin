import fastify, { type FastifyInstance } from "fastify";
import mongoose from "mongoose";
import { DiscordClient } from "./DiscordClient.js";
import { RouteClient } from "./RouteClient.js";

export interface RestConfig {
	/**
	 * The port to listen on.
	 * @default 3030
	 */
	port?: number;
	/**
	 * The host to listen on.
	 * @default 0.0.0.0
	 */
	host?: string;
	/**
	 * The mongodb connection string.
	 */
	mongodbConnectionString: string;
	/**
	 * The discord bot token.
	 */
	discordBotToken: string;
	/**
	 * The discord bot client id.
	 */
	discordBotClientId?: string
	/**
	 * If the discord client should connect to the gateway.
	 */
	discordConnectToGateway?: "allowed" | "disallowed";
}

/**
 * The CodeGoblin REST server.
 *
 * Build on top of Fastify and mongodb. It allows easy access to your discord bots API.
 */
export class CodeGoblinRest {
	private server: FastifyInstance;
	private discord: DiscordClient;

	public config: RestConfig;
	public router: RouteClient;

	public constructor(c: RestConfig) {
		if (!c.port) c.port = 3030;
		if (!c.host) c.host = "0.0.0.0";
		if (!c.mongodbConnectionString) {
			throw new Error("No mongodb connection string provided!");
		}
		if (!c.discordBotToken) {
			throw new Error("No discord bot token provided!");
		}
		if (!c.discordBotClientId) c.discordBotClientId = undefined

		this.config = c;

		this.server = fastify();
		this.router = new RouteClient(this.server, this.discord);
		this.discord = new DiscordClient(this.config);

		this.initServer();
		this.initMongodb();
	}

	private async initServer(): Promise<void> {
		const { config } = this;

		this.server.listen(
			{ port: config.port, host: config.host },
			(err, address) => {
				if (err) {
					console.error(err);
					process.exit(1);
				}
				console.log(`Server listening at ${address}`);
			}
		);
	}

	private async initMongodb(): Promise<void> {
		const { config } = this;

		mongoose
			.connect(config.mongodbConnectionString)
			.then(() => {
				console.info("Connected to Mongodb!");
			})
			.catch((err) => {
				console.error(`Error connecting to the database: ${err}`);
			});
	}
}
