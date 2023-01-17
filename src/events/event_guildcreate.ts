import type { Guild } from 'oceanic.js';
import config from '../config/config.js';
import { GlobalStatsModel } from '../database/schemas/statistics.js';
import { MainInstance } from '../main.js';

export default async function GuildCreateEvent(guild: Guild) {

	await MainInstance.utils.sendToLogChannel('api', {
		content: `Joined a new guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members. Now in ${MainInstance.DiscordClient.guilds.size} guilds.`
	});
	
	await GlobalStatsModel.findOneAndUpdate(
		{ find_id: 'global' },
		{ $inc: { guilds_joined: 1 } },
		{
			upsert: true,
			new: true
		}
	);

	// Load documents into cache on join if any exist
	if (!config.cacheDisabled.welcome) {
		const welcomePlugin = MainInstance.collections.commands.plugins.welcome;
		const hasWelcome = await welcomePlugin.query.findOne({ guild_id: guild.id });
		if (hasWelcome) welcomePlugin.cache.set(guild.id, hasWelcome);
	}
	if (!config.cacheDisabled.goodbye) {
		const goodbyePlugin = MainInstance.collections.commands.plugins.goodbye;
		const hasGoodbye = await goodbyePlugin.query.findOne({ guild_id: guild.id });
		if (hasGoodbye) goodbyePlugin.cache.set(guild.id, hasGoodbye);
	}

	if (!config.cacheDisabled.tags) {
		const tagPlugin = MainInstance.collections.commands.plugins.tags
		// Get the tags, because each tag has a record we have to find each tag with this guild id, which will return an array of tags
		const tags = await tagPlugin.query.find({ guild_id: guild.id });
		if (tags.length > 0) MainInstance.collections.commands.plugins.tags.cache.set(guild.id, tags);
	}
}
