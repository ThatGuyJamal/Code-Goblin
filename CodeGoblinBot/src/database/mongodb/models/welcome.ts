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

import { getModelForClass, ModelOptions, prop, type ReturnModelType } from '@typegoose/typegoose';
import { configValues } from '../../../config';
import { Collection } from 'discord.js';
import { container } from '@sapphire/framework';
import { GoodbyeModel } from './goodbye';

@ModelOptions({
	schemaOptions: {
		collection: 'welcome',
		timestamps: true,
		autoIndex: true
	}
})
export class WelcomeTypegooseSchema {
	@prop({ type: String, required: true })
	guild_id?: string;

	@prop({ type: String, default: null })
	channel_id?: string;

	@prop({ type: String, default: null })
	content?: string;

	@prop({ type: Boolean, default: false })
	enabled?: boolean;

	private static caching: boolean = configValues.caching.welcome;
	private static cache: Collection<string, WelcomeTypegooseSchema> = new Collection();

	static async initCache() {
		if (!this.caching) return;
		const configs = await GoodbyeModel.find();
		for (const config of configs) {
			this.cache.set(config.guild_id!, config);
		}

		container.logger.debug('Welcome Cache', `Loaded ${this.cache.size} server configs into cache.`);
	}

	/**
	 * Creates a Welcome document for a guild
	 * @param data
	 * @returns
	 */
	public static async CreateWelcome(this: ReturnModelType<typeof WelcomeTypegooseSchema>, data: WelcomeTypegooseSchema) {
		if (this.caching) this.cache.set(data.guild_id!, data);
		await this.create(data)
			.then((data) => {
				container.logger.debug(`[NEW WELCOME]`, data);
				return true;
			})
			.catch(() => {
				container.logger.debug(`[NEW WELCOME]`, `Failed to create welcome for ${data.guild_id}`);
				return false;
			});
	}

	/**
	 * Updates a Welcome message for a guild
	 * @param data
	 * @returns
	 */
	public static async UpdateWelcome(this: ReturnModelType<typeof WelcomeTypegooseSchema>, data: WelcomeTypegooseSchema): Promise<boolean> {
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
					channel_id: data.channel_id,
					content: data.content,
					enabled: data.enabled
				}
			},
			{
				new: true,
				upsert: true
			}
		)
			.then((res) => {
				container.logger.debug('[WELCOME UPDATE]', res);
				return res.acknowledged;
			})
			.catch(() => {
				container.logger.debug('[WELCOME UPDATE]', 'Failed to update welcome');
				return false;
			});
	}

	/**
	 * Deletes a Welcome message for a guild
	 * @param guildId
	 */
	public static async DeleteWelcome(this: ReturnModelType<typeof WelcomeTypegooseSchema>, guildId: string): Promise<boolean> {
		if (this.caching) {
			container.logger.debug('[WELCOME DELETE CACHE]', `Deleted ${guildId} from cache`);
			this.cache.delete(guildId);
		}

		container.logger.debug('[WELCOME DELETE]', `Deleted ${guildId} from database`);
		return !!(await this.deleteOne({ guild_id: guildId }));
	}

	/**
	 * Gets the Welcome message for a guild
	 * @param guildId
	 * @returns
	 */
	public static async GetWelcome(this: ReturnModelType<typeof WelcomeTypegooseSchema>, guildId: string): Promise<WelcomeTypegooseSchema | null> {
		if (this.caching) {
			container.logger.debug('[WELCOME GET CACHE]', `Got ${guildId} from cache`);
			return this.cache.get(guildId) ?? null;
		}

		container.logger.debug('[WELCOME GET]', `Got ${guildId} from database`);
		return this.findOne({ guild_id: guildId });
	}
}

export const WelcomeModel = getModelForClass(WelcomeTypegooseSchema);
