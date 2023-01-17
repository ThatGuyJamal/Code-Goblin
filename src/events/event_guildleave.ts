import type { Guild } from 'oceanic.js';
import config from '../config/config.js';
import { GlobalStatsModel } from '../database/schemas/statistics.js';
import { MainInstance } from '../main.js';

export default async function GuildCreateEvent(guild: Guild) {
	await MainInstance.utils.sendToLogChannel('api', {
		content: `Left a guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members. Now in ${MainInstance.DiscordClient.guilds.size} guilds.`
	});

	await GlobalStatsModel.findOneAndUpdate(
		{ find_id: 'global' },
		{ $inc: { guilds_left: 1 } },
		{
			upsert: true,
			new: true
		}
	);

	// Clear cache on guild leave to save memory
	if (!config.cacheDisabled.welcome) {
		const welcomePlugin = MainInstance.collections.commands.plugins.welcome;
		welcomePlugin.cache.delete(guild.id);
	}
	if (!config.cacheDisabled.goodbye) {
		const goodbyePlugin = MainInstance.collections.commands.plugins.goodbye;
		goodbyePlugin.cache.delete(guild.id);
	}

	if (!config.cacheDisabled.tags) {
		const tagPlugin = MainInstance.collections.commands.plugins.tags;
		// Get the tags, because each tag has a record we have to find each tag with this guild id, which will return an array of tags
		tagPlugin.cache.delete(guild.id);
	}
}
