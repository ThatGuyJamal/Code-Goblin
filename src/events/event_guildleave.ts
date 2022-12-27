import type { Guild } from 'oceanic.js';
import { GlobalStatsModel } from '../database/schemas/statistics.js';
import { MainInstance } from '../main.js';

export default async function GuildCreateEvent(guild: Guild) {
	await GlobalStatsModel.findOneAndUpdate(
		{ find_id: 'global' },
		{ $inc: { guilds_left: 1 } },
		{
			upsert: true,
			new: true
		}
	);

	await MainInstance.utils.sendToLogChannel('api', {
		content: `Left a guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members. Now in ${MainInstance.DiscordClient.guilds.size} guilds.`
	});

	// Clear cache on guild leave to save memory

	const TagPluginCache = MainInstance.collections.commands.plugins.tags.cache;
	const welcomePluginCache = MainInstance.collections.commands.plugins.welcome.cache;
	const GoodbyePluginCache = MainInstance.collections.commands.plugins.goodbye.cache;

	if (TagPluginCache.has(guild.id)) {
		TagPluginCache.delete(guild.id);
	}

	if (welcomePluginCache.has(guild.id)) {
		welcomePluginCache.delete(guild.id);
	}

	if (GoodbyePluginCache.has(guild.id)) {
		GoodbyePluginCache.delete(guild.id);
	}
}
