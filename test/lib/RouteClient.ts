import type { FastifyInstance } from "fastify";
import type { DiscordClient } from "./DiscordClient.js";

export class RouteClient {
	private server: FastifyInstance;
    private discord: DiscordClient;
	public constructor(server: FastifyInstance, discord: DiscordClient) {
		this.server = server;
        this.discord = discord;

		this.server.get("/", async (request, reply) => {
			return { botId: this.discord.clientId };
		});
	}
}
