import type { Guild } from 'oceanic.js';
import { GlobalStatsModel } from '../database/schemas/statistics.js';
import { MainInstance } from '../main.js';

export default async function GuildCreateEvent(guild: Guild) {
	await GlobalStatsModel.findOneAndUpdate(
		{ find_id: 'global' },
		{ $inc: { guilds_joined: 1 } },
		{
			upsert: true,
			new: true
		}
	);

	await MainInstance.utils.sendToLogChannel('api', {
		content: `Joined a new guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members. Now in ${MainInstance.DiscordClient.guilds.size} guilds.`
	});

	// Load documents into cache on join if any exist

	const welcomePlugin = MainInstance.collections.commands.plugins.welcome;
	const GoodbyePlugin = MainInstance.collections.commands.plugins.goodbye;

	const hasWelcome = await welcomePlugin.query.findOne({ guild_id: guild.id });
	const hasGoodbye = await GoodbyePlugin.query.findOne({ guild_id: guild.id });

	if (hasWelcome) {
		welcomePlugin.cache.set(guild.id, hasWelcome);
	}

	if (hasGoodbye) {
		GoodbyePlugin.cache.set(guild.id, hasGoodbye);
	}

	// Get the tags, because each tag has a record we have to find each tag with this guild id, which will return an array of tags
	const tags = await MainInstance.collections.commands.plugins.tags.query.find({ guild_id: guild.id });

	if (tags.length > 0) {
		MainInstance.collections.commands.plugins.tags.cache.set(guild.id, tags);
	}
}
