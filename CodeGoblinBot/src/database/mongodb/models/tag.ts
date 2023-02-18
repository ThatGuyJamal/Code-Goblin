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

export enum TagLimits {
	MAX_CREATED_TAGS = 10
}

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

	/**
	 * Creates a new tag in the database
	 * @param data
	 */
	public static async CreateTag(this: ReturnModelType<typeof TagTypegooseSchema>, data: TagTypegooseSchema) {
		await this.create(data);
	}

	/**
	 * Updates a tag in the database
	 * @param data
	 * @returns
	 */
	public static async UpdateTag(
		this: ReturnModelType<typeof TagTypegooseSchema>,
		data: {
			guild_id: string;
			name: string;
			content: string;
		}
	): Promise<boolean> {
		return await this.updateOne(
			{
				guild_id: data.guild_id
			},
			{
				$set: {
					name: data.name,
					content: data.content
				}
			},
			{
				new: true,
				upsert: true
			}
		)
			.then((res) => res.acknowledged)
			.catch(() => false);
	}

	/**
	 * Deletes all tags in the database for a guild
	 * @param guildId
	 * @returns
	 */
	public static async DeleteTags(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string): Promise<boolean> {
		return !!(await this.deleteOne({ guild_id: guildId }));
	}

	/**
	 * Deletes a tag in the database for a guild
	 * @param guildId
	 * @param name
	 * @returns
	 */
	public static async DeleteTag(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string, name: string): Promise<boolean> {
		return !!(await this.deleteOne({ guild_id: guildId, name: name }));
	}

	/**
	 * Gets all tags in the database for a guild
	 * @param guildId
	 * @returns
	 */
	public static async GetTags(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string): Promise<TagTypegooseSchema[]> {
		return (await this.find({ guild_id: guildId })) ?? [];
	}

	/**
	 * Gets a tag in the database for a guild
	 * @param guildId
	 * @param name
	 * @returns
	 */
	public static async GetTag(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string, name: string): Promise<TagTypegooseSchema | null> {
		return (await this.findOne({ guild_id: guildId, name: name })) ?? null;
	}

	public static async CheckIfTagExists(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string, name: string): Promise<boolean> {
		return !!(await this.exists({ guild_id: guildId, name: name }));
	}

	/**
	 * Checks if the max amount of tags has been reached for a guild
	 * @param guildId
	 * @returns
	 */
	public static async CheckIfLimited(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string): Promise<boolean> {
		return (await this.countDocuments({ guild_id: guildId })) >= TagLimits.MAX_CREATED_TAGS;
	}
}

export const TagModel = getModelForClass(TagTypegooseSchema);
