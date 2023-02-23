/**
 *  Code Goblin - A discord bot for programmers.

 Copyright (C) 2022, ThatGuyJamal and contributors
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.
 */

import { getModelForClass, ModelOptions, prop, ReturnModelType } from '@typegoose/typegoose';
import { Collection, Snowflake } from 'discord.js';
import { container } from '@sapphire/framework';
import { configValues } from '../../../config';

export enum ServerConfigDefaults {
	REPUTATION_GAINS = 1,

	LANGUAGE = 'en-US'
}

@ModelOptions({
	schemaOptions: {
		collection: 'server-configs',
		timestamps: true,
		autoIndex: true
	}
})
class ServerConfig {
	@prop({ type: String, required: true })
	guild_id?: string;

	@prop({ type: String, default: 'en-US' })
	language?: string;

	@prop({ type: Boolean, default: false })
	reputation_enabled?: boolean;

	@prop({ type: Number, default: 1 })
	// Controls how many reputation points a user is given when they message in a server.
	reputation_gains?: number;

	@prop({ type: String, default: null })
	rank_up_channel?: string;

	@prop({ type: Boolean, default: true })
	/** Whether to send a message when a user ranks up */
	reputation_rank_up_message_enabled?: boolean;

	@prop({ type: String, default: null })
	reputation_rank_up_message?: string;

	private static caching: boolean = configValues.caching.serverConfig;
	private static cache: Collection<string, ServerConfig> = new Collection();

	static async initCache() {
		if (!this.caching) return;
		const configs = await ServerConfigModel.find();
		for (const config of configs) {
			this.cache.set(config.guild_id!, config);
		}

		container.logger.debug('Server Config Cache', `Loaded ${this.cache.size} server configs into cache.`);
	}

	/**
	 * Creates a new server config in the database
	 * @param data
	 * @returns
	 */
	public static async CreateServerConfig(this: ReturnModelType<typeof ServerConfig>, data: ServerConfig): Promise<boolean> {
		if (this.caching) this.cache.set(data.guild_id!, data);
		return await this.create(data)
			.then((data) => {
				container.logger.debug(`[NEW SERVER CONFIG]`, data);
				return true;
			})
			.catch(() => {
				container.logger.debug(`[NEW SERVER CONFIG]`, `Failed to create server config for ${data.guild_id}`);
				return false;
			});
	}

	/**
	 * Updates a server config in the database
	 * @param data
	 * @constructor
	 */
	public static async UpdateServerConfig(this: ReturnModelType<typeof ServerConfig>, data: ServerConfig): Promise<boolean> {
		if (this.caching) {
			const cached = this.cache.get(data.guild_id!);
			if (cached) {
				this.cache.set(data.guild_id!, { ...cached, ...data });
			} else {
				this.cache.set(data.guild_id!, data);
			}
		}
		return await this.updateOne(
			{
				guild_id: data.guild_id
			},
			{
				$set: {
					language: data.language,
					reputation_enabled: data.reputation_enabled,
					reputation_gains: data.reputation_gains,
					reputation_rank_up_message_enabled: data.reputation_rank_up_message_enabled,
					reputation_rank_up_message: data.reputation_rank_up_message,
					rank_up_channel: data.rank_up_channel
				}
			},
			{
				upsert: true,
				new: true
			}
		)
			.then(() => {
				container.logger.debug(`[UPDATE SERVER CONFIG]`, data);
				return true;
			})
			.catch(() => {
				container.logger.debug(`[UPDATE SERVER CONFIG]`, `Failed to update server config for ${data.guild_id}`);
				return false;
			});
	}

	public static async GetServerConfig(this: ReturnModelType<typeof ServerConfig>, guildId: string): Promise<ServerConfig | null> {
		if (this.caching) {
			container.logger.debug(`[GET SERVER CONFIG CACHE]`, `Retrieved server config for ${guildId} from cache.`);
			return this.cache.get(guildId) ?? null;
		}

		container.logger.debug(`[GET SERVER CONFIG]`, `Retrieved server config for ${guildId} from database.`);
		return (await this.findOne({ guild_id: guildId })) ?? null;
	}

	public static async GetServerConfigLanguage(this: ReturnModelType<typeof ServerConfig>, guildId: string | Snowflake): Promise<string> {
		if (this.caching) {
			container.logger.debug(`[GET SERVER CONFIG LANGUAGE CACHE]`, `Retrieved server config language for ${guildId} from cache.`);
			return this.cache.get(guildId)?.language ?? ServerConfigDefaults.LANGUAGE;
		}

		container.logger.debug(`[GET SERVER CONFIG LANGUAGE]`, `Retrieved server config language for ${guildId} from database.`);
		return (await this.findOne({ guild_id: guildId }))?.language ?? ServerConfigDefaults.LANGUAGE;
	}

	public static async GetServerConfigReputationEnabled(this: ReturnModelType<typeof ServerConfig>, guildId: string | Snowflake): Promise<boolean> {
		if (this.caching) {
			container.logger.debug(
				`[GET SERVER CONFIG REPUTATION ENABLED CACHE]`,
				`Retrieved server config reputation enabled for ${guildId} from cache.`
			);
			return this.cache.get(guildId)?.reputation_enabled ?? false;
		}

		container.logger.debug(`[GET SERVER CONFIG REPUTATION ENABLED]`, `Retrieved server config reputation enabled for ${guildId} from database.`);
		return (await this.findOne({ guild_id: guildId }))?.reputation_enabled ?? false;
	}

	public static async GetServerConfigReputationGains(this: ReturnModelType<typeof ServerConfig>, guildId: string | Snowflake): Promise<number> {
		if (this.caching) {
			container.logger.debug(
				`[GET SERVER CONFIG REPUTATION GAINS CACHE]`,
				`Retrieved server config reputation gains for ${guildId} from cache.`
			);
			return this.cache.get(guildId)?.reputation_gains ?? ServerConfigDefaults.REPUTATION_GAINS;
		}

		container.logger.debug(`[GET SERVER CONFIG REPUTATION GAINS]`, `Retrieved server config reputation gains for ${guildId} from database.`);
		return (await this.findOne({ guild_id: guildId }))?.reputation_gains ?? ServerConfigDefaults.REPUTATION_GAINS;
	}

	public static async DeleteServerConfig(this: ReturnModelType<typeof ServerConfig>, guildId: string): Promise<boolean> {
		if (this.caching) {
			container.logger.debug(`[DELETE SERVER CONFIG CACHE]`, `Deleted server config for ${guildId} from cache.`);
			this.cache.delete(guildId);
		}

		container.logger.debug(`[DELETE SERVER CONFIG]`, `Deleted server config for ${guildId} from database.`);
		return await this.deleteOne({ guild_id: guildId })
			.then(() => {
				container.logger.debug(`[DELETE SERVER CONFIG]`, `Deleted server config for ${guildId} from database.`);
				return true;
			})
			.catch(() => {
				container.logger.debug(`[DELETE SERVER CONFIG]`, `Failed to delete server config for ${guildId} from database.`);
				return false;
			});
	}
}

export const ServerConfigModel = getModelForClass(ServerConfig);
