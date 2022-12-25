import type { Guild } from 'oceanic.js';

export default async function GuildCreateEvent(guild: Guild) {
	console.log(`[EVENT] Joined a new guild: ${guild.name} (${guild.id})`);
}
