import type { Guild, Member, TextChannel, Uncached } from 'oceanic.js';
import { logger } from '../../utils/index.js';
import { Main } from '../index.js';

export default async function (member: Member, _guild: Guild | Uncached) {
	const result = await getGoodbyeResults(member);

	if (!result) return;

	await result.GoodbyeChannel.createMessage({
		content: result.GoodbyeMessage,
		allowedMentions: {
			users: true,
			roles: true
		}
	}).catch((err) => {
		logger.error(err);
	});
}

export async function getGoodbyeResults(member: Member) {
	const { guild } = member;

	if (!guild) return;

	const data = await Main.collections.controllers.goodbye.GetGoodbye(guild.id);

	if (!data) return;

	const GoodbyeChannel = Main.DiscordClient.getChannel(data.channel_id) as TextChannel;

	if (!GoodbyeChannel) return;

	const GoodbyeMessage = Main.utils.FormatPluginStringData(member, data.content);

	return { GoodbyeChannel, GoodbyeMessage };
}
