import { config } from './config.js';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';

const client = new SapphireClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
	logger: {
		level: config.IsInDevelopmentMode ? LogLevel.Debug : LogLevel.Info
	},
	hmr: {
		enabled: config.IsInDevelopmentMode,
		silent: false
	}
});

export async function runClient() {
    await client.login(config.BotToken);
}