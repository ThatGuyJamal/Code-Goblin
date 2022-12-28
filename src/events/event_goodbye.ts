import type { Guild, Member, TextChannel, Uncached } from 'oceanic.js';
import { MainInstance } from '../main.js';

export default async function (member: Member, guild: Guild | Uncached) {
	const result = await getGoodbyeResults(member);

	if (!result) return;

	await result.GoodbyeChannel.createMessage({
		content: result.GoodbyeMessage
	}).catch(() => {});
}

export async function getGoodbyeResults(member: Member) {
	const { guild } = member;

	if (!guild) return;

	const data = await MainInstance.collections.commands.plugins.goodbye.GetGoodbye(guild.id);

	if (!data) return;

	const GoodbyeChannel = MainInstance.DiscordClient.getChannel(data.channel_id) as TextChannel;

	if (!GoodbyeChannel) return;

	const GoodbyeMessage = MainInstance.utils.FormatPluginStringData(member, data.content);

	return { GoodbyeChannel, GoodbyeMessage };
}
