import type { CreateMessageOptions, TextChannel } from 'oceanic.js';
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
}
