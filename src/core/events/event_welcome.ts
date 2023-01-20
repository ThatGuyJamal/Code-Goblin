import type { Member, TextChannel } from 'oceanic.js';
import { logger } from '../../utils/index.js';
import { Main } from '../index.js';

export default async function (member: Member) {
	const result = await getWelcomeResults(member);

	if (!result) return;

	await result.welcomeChannel
		.createMessage({
			content: result.welcomeMessage,
			allowedMentions: {
				users: true,
				roles: true
			}
		})
		.catch((err) => {
			logger.error(err);
		});
}

export async function getWelcomeResults(member: Member) {
	const { guild } = member;

	if (!guild) return;

	const data = await Main.collections.controllers.welcome.GetWelcome(guild.id);

	if (!data) return;

	const welcomeChannel = Main.DiscordClient.getChannel(data.channel_id) as TextChannel;

	if (!welcomeChannel) return;

	const welcomeMessage = Main.utils.FormatPluginStringData(member, data.content);

	return { welcomeChannel, welcomeMessage };
}
