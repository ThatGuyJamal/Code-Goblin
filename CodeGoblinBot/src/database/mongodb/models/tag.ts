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

export enum TagLimits {
	MAX_CREATED_TAGS = 10
}

type CacheSearch = {
	guild_id: string;
	name: string;
};

@ModelOptions({
	schemaOptions: {
		collection: 'tags',
		timestamps: true,
		autoIndex: true
	}
})
export class TagTypegooseSchema {
	@prop({ type: String, required: true })
	guild_id?: string;

	@prop({ type: String, default: null })
	name?: string;

	@prop({ type: String, default: null })
	content?: string;

	@prop({ type: String, default: null })
	created_by_name?: string;

	@prop({ type: String, default: null })
	created_by_id?: string;

	private static caching: boolean = configValues.caching.tag;
	private static cache: Collection<CacheSearch, TagTypegooseSchema> = new Collection();

	static async initCache() {
		if (!this.caching) return;
		const configs = await TagModel.find();
		for (const config of configs) {
			this.cache.set(
				{
					guild_id: config.guild_id!,
					name: config.name!
				},
				config
			);
		}

		container.logger.debug('Tags Cache', `Loaded ${this.cache.size} server configs into cache.`);
	}

	/**
	 * Creates a new tag in the database
	 * @param data
	 */
	public static async CreateTag(this: ReturnModelType<typeof TagTypegooseSchema>, data: TagTypegooseSchema) {
		if (this.caching) {
			this.cache.set(
				{
					guild_id: data.guild_id!,
					name: data.name!
				},
				data
			);
		}
		await this.create(data)
			.then((res) => {
				container.logger.debug(`[TAG CREATE] Created tag ${res.name} in guild ${res.guild_id}`, res);
			})
			.catch((err) => {
				container.logger.error(`[TAG CREATE] Failed to create tag ${data.name} in guild ${data.guild_id}`, err);
			});
	}

	/**
	 * Updates a tag in the database
	 * @param data
	 * @returns
	 */
	public static async UpdateTag(this: ReturnModelType<typeof TagTypegooseSchema>, data: TagTypegooseSchema): Promise<boolean> {
		if (this.caching) {
			const cached = this.cache.get({
				guild_id: data.guild_id!,
				name: data.name!
			});
			if (cached) {
				cached.content = data.content ?? cached.content;
				cached.created_by_name = data.created_by_name ?? cached.created_by_name;
				cached.created_by_id = data.created_by_id ?? cached.created_by_id;

				this.cache.set(
					{
						guild_id: data.guild_id!,
						name: data.name!
					},
					cached
				);
			} else {
				this.cache.set(
					{
						guild_id: data.guild_id!,
						name: data.name!
					},
					data
				);
			}
		}
		return await this.updateOne(
			{
				guild_id: data.guild_id
			},
			{
				$set: {
					name: data.name,
					content: data.content,
					created_by_name: data.created_by_name,
					created_by_id: data.created_by_id
				}
			},
			{
				new: true,
				upsert: true
			}
		)
			.then((res) => {
				container.logger.debug(`[TAG UPDATE CACHE] Updated tag ${data.name} in guild ${data.guild_id}`, res);
				return res.acknowledged;
			})
			.catch(() => {
				container.logger.error(`[TAG UPDATE] Failed to update tag ${data.name} in guild ${data.guild_id}`);
				return false;
			});
	}

	/**
	 * Deletes all tags in the database for a guild
	 * @param guildId
	 * @returns
	 */
	public static async DeleteTags(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string): Promise<boolean> {
		if (this.caching) {
			const cached = this.cache.filter((config) => config.guild_id === guildId);
			for (const config of cached.values()) {
				this.cache.delete({
					guild_id: config.guild_id!,
					name: config.name!
				});
			}

			container.logger.debug(`[TAG DELETE CACHE] Deleted ${cached.size} tags in guild ${guildId}`);
		}

		container.logger.debug(`[TAG DELETE] Deleted all tags in guild ${guildId}`);
		return !!(await this.deleteMany({ guild_id: guildId }));
	}

	/**
	 * Deletes a tag in the database for a guild
	 * @param guildId
	 * @param name
	 * @returns
	 */
	public static async DeleteTag(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string, name: string): Promise<boolean> {
		if (this.caching) {
			container.logger.debug(`[TAG DELETE CACHE] Deleted tag ${name} in guild ${guildId}`);
			return this.cache.delete({ guild_id: guildId, name: name });
		}

		container.logger.debug(`[TAG DELETE] Deleted tag ${name} in guild ${guildId}`);
		return !!(await this.deleteOne({ guild_id: guildId, name: name }));
	}

	/**
	 * Gets all tags in the database for a guild
	 * @param guildId
	 * @returns
	 */
	public static async GetTags(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string): Promise<TagTypegooseSchema[]> {
		if (this.caching) {
			container.logger.debug(`[TAG GET CACHE] Got all tags in guild ${guildId}`);
			return this.cache.filter((config) => config.guild_id === guildId).map((config) => config) ?? [];
		}

		container.logger.debug(`[TAG GET] Got all tags in guild ${guildId}`);
		return (await this.find({ guild_id: guildId })) ?? [];
	}

	/**
	 * Gets a tag in the database for a guild
	 * @param guildId
	 * @param name
	 * @returns
	 */
	public static async GetTag(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string, name: string): Promise<TagTypegooseSchema | null> {
		if (this.caching) {
			container.logger.debug(`[TAG GET CACHE] Got tag ${name} in guild ${guildId}`);
			return this.cache.get({ guild_id: guildId, name: name }) ?? null;
		}

		container.logger.debug(`[TAG GET] Got tag ${name} in guild ${guildId}`);
		return (await this.findOne({ guild_id: guildId, name: name })) ?? null;
	}

	public static async CheckIfTagExists(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string, name: string): Promise<boolean> {
		if (this.caching) {
			container.logger.debug(`[TAG EXISTS CACHE] Checked if tag ${name} exists in guild ${guildId}`);
			return this.cache.has({ guild_id: guildId, name: name });
		}

		container.logger.debug(`[TAG EXISTS] Checked if tag ${name} exists in guild ${guildId}`);
		return !!(await this.exists({ guild_id: guildId, name: name }));
	}

	/**
	 * Checks if the max amount of tags has been reached for a guild
	 * @param guildId
	 * @returns
	 */
	public static async CheckIfLimited(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string): Promise<boolean> {
		if (this.caching) {
			container.logger.debug(`[TAG LIMIT CACHE] Checked if tag limit has been reached in guild ${guildId}`);
			return this.cache.filter((config) => config.guild_id === guildId).size >= TagLimits.MAX_CREATED_TAGS;
		}

		container.logger.debug(`[TAG LIMIT] Checked if tag limit has been reached in guild ${guildId}`);
		return (await this.countDocuments({ guild_id: guildId })) >= TagLimits.MAX_CREATED_TAGS;
	}
}

export const TagModel = getModelForClass(TagTypegooseSchema);
