import { getModelForClass, ModelOptions, prop, type ReturnModelType } from '@typegoose/typegoose';
import { TagLimits } from '../../../typings/database/types.js';

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
	 * @param this
	 * @param data
	 */
	public static async CreateTag(this: ReturnModelType<typeof TagTypegooseSchema>, data: TagTypegooseSchema) {
		await this.create(data);
	}

	/**
	 * Updates a tag in the database
	 * @param this
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
	 * @param this
	 * @param guildId
	 * @returns
	 */
	public static async DeleteTags(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string): Promise<boolean> {
		return (await this.deleteOne({ guild_id: guildId })) ? true : false;
	}

	/**
	 * Deletes a tag in the database for a guild
	 * @param this
	 * @param guildId
	 * @param name
	 * @returns
	 */
	public static async DeleteTag(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string, name: string): Promise<boolean> {
		return (await this.deleteOne({ guild_id: guildId, name: name })) ? true : false;
	}

	/**
	 * Gets all tags in the database for a guild
	 * @param this
	 * @param guildId
	 * @returns
	 */
	public static async GetTags(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string): Promise<TagTypegooseSchema[]> {
		return (await this.find({ guild_id: guildId })) ?? [];
	}

	/**
	 * Gets a tag in the database for a guild
	 * @param this
	 * @param guildId
	 * @param name
	 * @returns
	 */
	public static async GetTag(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string, name: string): Promise<TagTypegooseSchema | null> {
		return (await this.findOne({ guild_id: guildId, name: name })) ?? null;
	}

	public static async CheckIfTagExists(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string, name: string): Promise<boolean> {
		return (await this.exists({ guild_id: guildId, name: name })) ? true : false;
	}

	/**
	 * Checks if the max amount of tags has been reached for a guild
	 * @param this
	 * @param guildId
	 * @returns
	 */
	public static async CheckIfLimited(this: ReturnModelType<typeof TagTypegooseSchema>, guildId: string): Promise<boolean> {
		return (await this.countDocuments({ guild_id: guildId })) >= TagLimits.MAX_CREATED_TAGS ? true : false;
	}
}

export const TagModel = getModelForClass(TagTypegooseSchema);
