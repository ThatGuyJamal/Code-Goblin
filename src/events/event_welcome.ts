import type { Member, TextChannel } from 'oceanic.js';
import { MainInstance } from '../main.js';

export default async function (member: Member) {
	const result = await getWelcomeResults(member);

	if (!result) return;

	await result.welcomeChannel
		.createMessage({
			content: result.welcomeMessage
		})
		.catch(() => {});
}

export async function getWelcomeResults(member: Member) {
	const { guild } = member;

	if (!guild) return;

	const data = await MainInstance.collections.commands.plugins.welcome.GetWelcome(guild.id);

	if (!data) return;

	const welcomeChannel = MainInstance.DiscordClient.getChannel(data.channel_id) as TextChannel;

	if (!welcomeChannel) return;

	const welcomeMessage = MainInstance.utils.FormatPluginStringData(member, data.content);

	return { welcomeChannel, welcomeMessage };
}
