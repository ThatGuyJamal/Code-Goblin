import type { Guild } from 'oceanic.js';
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
}
