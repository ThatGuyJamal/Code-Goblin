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

	/**
	 * Creates a Goodbye document for a guild
	 * @param data
	 * @returns
	 */
	public static async CreateGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, data: GoodbyeTypegooseSchema) {
		await this.create(data);
	}

	/**
	 * Updates a Goodbye message for a guild
	 * @param data
	 * @returns
	 */
	public static async UpdateGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, data: GoodbyeTypegooseSchema): Promise<boolean> {
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
			.then((res) => res.acknowledged)
			.catch(() => false);
	}

	/**
	 * Deletes a Goodbye message for a guild
	 * @param guildId
	 */
	public static async DeleteGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, guildId: string): Promise<boolean> {
		return !!(await this.deleteOne({ guild_id: guildId }));
	}

	/**
	 * Gets the Goodbye message for a guild
	 * @param guildId
	 * @returns
	 */
	public static async GetGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, guildId: string): Promise<GoodbyeTypegooseSchema | null> {
		return this.findOne({ guild_id: guildId });
	}
}

export const GoodbyeModel = getModelForClass(GoodbyeTypegooseSchema);
