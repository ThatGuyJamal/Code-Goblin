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
import { configValues } from '../../../config';
import { Collection } from 'discord.js';
import { container } from '@sapphire/framework';

@ModelOptions({
	schemaOptions: {
		collection: 'goodbye',
		timestamps: true,
		autoIndex: true
	}
})
export class GoodbyeTypegooseSchema {
	@prop({ type: String, required: true })
	guild_id?: string;

	@prop({ type: String, default: null })
	channel_id?: string;

	@prop({ type: String, default: null })
	content?: string;

	@prop({ type: Boolean, default: false })
	enabled?: boolean;

	private static caching: boolean = configValues.caching.goodbye;
	private static cache: Collection<string, GoodbyeTypegooseSchema> = new Collection();

	static async initCache() {
		if (!this.caching) return;
		const configs = await GoodbyeModel.find();
		for (const config of configs) {
			this.cache.set(config.guild_id!, config);
		}

		container.logger.debug('Goodbye Cache', `Loaded ${this.cache.size} server configs into cache.`);
	}

	/**
	 * Creates a Goodbye document for a guild
	 * @param data
	 * @returns
	 */
	public static async CreateGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, data: GoodbyeTypegooseSchema): Promise<boolean> {
		if (this.caching) this.cache.set(data.guild_id!, data);
		return await this.create(data)
			.then((data) => {
				container.logger.debug(`[NEW GOODBYE]`, data);
				return true;
			})
			.catch(() => {
				container.logger.debug(`[NEW GOODBYE]`, `Failed to create goodbye for ${data.guild_id}`);
				return false;
			});
	}

	/**
	 * Updates a Goodbye message for a guild
	 * @param data
	 * @returns
	 */
	public static async UpdateGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, data: GoodbyeTypegooseSchema): Promise<boolean> {
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
				container.logger.debug('[GOODBYE UPDATE]', res);
				return res.acknowledged;
			})
			.catch(() => {
				container.logger.debug('[GOODBYE UPDATE]', 'Failed to update goodbye');
				return false;
			});
	}

	/**
	 * Deletes a Goodbye message for a guild
	 * @param guildId
	 */
	public static async DeleteGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, guildId: string): Promise<boolean> {
		if (this.caching) {
			container.logger.debug('[GOODBYE DELETE CACHE]', `Deleted goodbye message for guild ${guildId}`);
			this.cache.delete(guildId);
		}

		container.logger.debug('[GOODBYE DELETE]', `Deleted goodbye message for guild ${guildId}`);
		return !!(await this.deleteOne({ guild_id: guildId }));
	}

	/**
	 * Gets the Goodbye message for a guild
	 * @param guildId
	 * @returns
	 */
	public static async GetGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, guildId: string): Promise<GoodbyeTypegooseSchema | null> {
		if (this.caching) {
			container.logger.debug('[GOODBYE GET CACHE]', `Got goodbye message for guild ${guildId}`);
			return this.cache.get(guildId) ?? null;
		}

		container.logger.debug('[GOODBYE GET]', `Got goodbye message for guild ${guildId}`);
		return this.findOne({ guild_id: guildId });
	}
}

export const GoodbyeModel = getModelForClass(GoodbyeTypegooseSchema);
