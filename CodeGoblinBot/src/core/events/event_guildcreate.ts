import type { Guild } from 'oceanic.js';
import { Main } from '../index.js';

export default async function GuildCreateEvent(guild: Guild) {
	await Main.utils.sendToLogChannel(
		'api',
		`Joined a new guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members. Now in ${Main.DiscordClient.guilds.size} guilds.`
	);

	await Main.database.schemas.statistics.UpdateGuildsJoined();
}
