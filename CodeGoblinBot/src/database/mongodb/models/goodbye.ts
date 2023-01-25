import { prop, ReturnModelType, ModelOptions, getModelForClass } from '@typegoose/typegoose';

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
	 * @param this
	 * @param data
	 * @returns
	 */
	public static async CreateGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, data: GoodbyeTypegooseSchema) {
		await this.create(data);
	}

	/**
	 * Updates a Goodbye message for a guild
	 * @param guildId
	 * @param channelId
	 * @param contentType
	 * @param content
	 * @param enabled
	 * @returns
	 */
	public static async UpdateGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, data: GoodbyeTypegooseSchema): Promise<boolean> {
		return await this.updateOne(
			{
				guild_id: data.guild_id
			},
			{
				data
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
		return (await this.deleteOne({ guild_id: guildId })) ? true : false;
	}

	/**
	 * Gets the Goodbye message for a guild
	 * @param guildId
	 * @returns
	 */
	public static async GetGoodbye(this: ReturnModelType<typeof GoodbyeTypegooseSchema>, guildId: string): Promise<GoodbyeTypegooseSchema | null> {
		return await this.findOne({ guild_id: guildId });
	}
}

export const GoodbyeModel = getModelForClass(GoodbyeTypegooseSchema);
