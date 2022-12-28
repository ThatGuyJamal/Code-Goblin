import type { CreateMessageOptions, Member, TextChannel } from 'oceanic.js';
import config from '../config/config.js';
import type Main from '../main';

export class Utils {
	private instance: Main;

	constructor(instance: Main) {
		this.instance = instance;
	}

	/**
	 * Sends logs to the log channels
	 * @param type
	 * @param options
	 * @returns
	 */
	public sendToLogChannel(type: 'error' | 'api', options: CreateMessageOptions) {
		const log = this.instance.DiscordClient.getChannel(type === 'error' ? config.BotErrorLogChannelId : config.BotApiLogChannelId) as TextChannel;

		if (!log) return;

		return log.createMessage(options);
	}

	/**
	 * Formats a string for a plugin using our needed regex replacements
	 * @param member
	 * @param str the string to format
	 * @returns
	 */
	public FormatPluginStringData(member: Member, str: string): string {
		return str
			.replaceAll(/{user}/g, member.mention)
			.replaceAll(/{user_id}/g, member.id)
			.replaceAll(/{user_tag}/g, member.tag)
			.replaceAll(/{user_username}/g, member.username)
			.replaceAll(/{user_discriminator}/g, member.discriminator)
			.replaceAll(/{user_createdAt}/g, member.createdAt.toString())
			.replaceAll(/{server}/g, member.guild.name)
			.replaceAll(/{server_id}/g, member.guild.id)
			.replaceAll(/{memberCount}/g, member.guild.memberCount.toString());
	}
}
