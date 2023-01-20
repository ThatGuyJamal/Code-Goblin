import type { Guild } from 'oceanic.js';
import { GlobalStatsModel } from '../../database/index.js';
import config from '../../config/config.js';
import { Main } from '../index.js';

export default async function GuildCreateEvent(guild: Guild) {
	await Main.utils.sendToLogChannel('api', {
		content: `Joined a new guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members. Now in ${Main.DiscordClient.guilds.size} guilds.`
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
		const welcomePlugin = Main.collections.controllers.welcome;
		const hasWelcome = await welcomePlugin.query.findOne({ guild_id: guild.id });
		if (hasWelcome) welcomePlugin.cache.set(guild.id, hasWelcome);
	}
	if (!config.cacheDisabled.goodbye) {
		const goodbyePlugin = Main.collections.controllers.goodbye;
		const hasGoodbye = await goodbyePlugin.query.findOne({ guild_id: guild.id });
		if (hasGoodbye) goodbyePlugin.cache.set(guild.id, hasGoodbye);
	}

	if (!config.cacheDisabled.tags) {
		const tagPlugin = Main.collections.controllers.tags;
		// Get the tags, because each tag has a record we have to find each tag with this guild id, which will return an array of tags
		const tags = await tagPlugin.query.find({ guild_id: guild.id });
		if (tags.length > 0) Main.collections.controllers.tags.cache.set(guild.id, tags);
	}
}
