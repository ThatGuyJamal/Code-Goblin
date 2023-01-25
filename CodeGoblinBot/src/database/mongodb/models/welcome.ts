import { getModelForClass, ModelOptions, prop, type ReturnModelType } from '@typegoose/typegoose';

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

	/**
	 * Creates a Welcome document for a guild
	 * @param this
	 * @param data
	 * @returns
	 */
	public static async CreateWelcome(this: ReturnModelType<typeof WelcomeTypegooseSchema>, data: WelcomeTypegooseSchema) {
		await this.create(data);
	}

	/**
	 * Updates a Welcome message for a guild
	 * @param guildId
	 * @param channelId
	 * @param contentType
	 * @param content
	 * @param enabled
	 * @returns
	 */
	public static async UpdateWelcome(this: ReturnModelType<typeof WelcomeTypegooseSchema>, data: WelcomeTypegooseSchema): Promise<boolean> {
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
	 * Deletes a Welcome message for a guild
	 * @param guildId
	 */
	public static async DeleteWelcome(this: ReturnModelType<typeof WelcomeTypegooseSchema>, guildId: string): Promise<boolean> {
		return (await this.deleteOne({ guild_id: guildId })) ? true : false;
	}

	/**
	 * Gets the Welcome message for a guild
	 * @param guildId
	 * @returns
	 */
	public static async GetWelcome(this: ReturnModelType<typeof WelcomeTypegooseSchema>, guildId: string): Promise<WelcomeTypegooseSchema | null> {
		return await this.findOne({ guild_id: guildId });
	}
}

export const WelcomeModel = getModelForClass(WelcomeTypegooseSchema);