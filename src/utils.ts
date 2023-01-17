import type { CreateMessageOptions, Member, TextChannel } from 'oceanic.js';
import type { Command, CommandDataProp } from './command.js';
import config from './config/config.js';
import { logger } from './index.js';
import type Main from './main';

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

	/**
	 * Gets the command list from the command store
	 */
	public get CommandList(): IterableIterator<Command> {
		return this.instance.collections.commands.commandStoreMap.values();
	}

	/**
	 * Adds a command to the command store
	 * @param cmd
	 */
	public addCommand(cmd: CommandDataProp) {
		try {
			// if the command is disabled, don't add it to the command store
			if (!cmd.props.disabled) {
				this.instance.collections.commands.commandStoreMap.set(cmd.props.trigger, cmd.props);

				if (cmd.props.register === 'global') {
					this.instance.collections.commands.commandStoreArrayJsonGlobal.push(cmd.toJson());
				} else if (cmd.props.register === 'guild') {
					this.instance.collections.commands.commandStoreArrayJsonGuild.push(cmd.toJson());
				} else if (cmd.props.register === 'both') {
					this.instance.collections.commands.commandStoreArrayJsonGlobal.push(cmd.toJson());
					this.instance.collections.commands.commandStoreArrayJsonGuild.push(cmd.toJson());
				}
				logger.info(`Loaded ${cmd.props.trigger} into memory.`);
			} else {
				logger.info(`${cmd.props.trigger} was not loaded into memory because it is disabled.`);
			}
		} catch (err) {
			logger.error(`[ERROR] Failed to load command ${cmd.props.trigger} into memory.`, err);
			logger.error(err);
		}
	}
}
