import { getModelForClass, ModelOptions, prop, type ReturnModelType } from '@typegoose/typegoose';

@ModelOptions({
	schemaOptions: {
		collection: 'code-jams',
		timestamps: true,
		autoIndex: true
	}
})
export class CodeJamTypegooseSchema {
	@prop({ type: String, required: true })
	guild_id?: string;

	@prop({ type: String, required: false, default: null })
	event_role_id?: string;

	@prop({ type: String, required: false, default: null })
	event_managers_role_id?: string;

	@prop({ type: [String], required: false, default: [] })
	event_participants_ids?: string[];

	@prop({ type: [String], required: false, default: [] })
	event_managers_ids?: string[];

	@prop({ type: String, required: false, default: null })
	event_channel?: string;

	@prop({ type: String, required: false, default: 'No Name Configured' })
	name?: string;

	@prop({ type: String, required: false, default: 'No Name Configured' })
	description?: string;

	@prop({ type: String, required: false, default: null })
	event_image_url?: string;

	@prop({ type: String, required: false, default: null })
	event_scheduled_start_time?: string;

	@prop({ type: String, required: false, default: null })
	event_scheduled_end_time?: string;

	@prop({ type: String, required: false, default: null })
	entityType?: string;

	@prop({ type: String, required: false, default: null })
	created_by_name?: string;

	@prop({ type: String, required: false, default: null })
	created_by_id?: string;

	/**
	 * Creates a new tag in the database
	 * @param this
	 * @param data
	 */
	public static async CreateJam(this: ReturnModelType<typeof CodeJamTypegooseSchema>, data: CodeJamTypegooseSchema) {
		await this.create(data);
	}

	/**
	 * Deletes the code jam in the database for a guild
	 * @param this
	 * @param guildId
	 * @returns
	 */
	public static async DeleteJam(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string): Promise<boolean> {
		return (await this.deleteOne({ guild_id: guildId })) ? true : false;
	}

	/**
	 * Gets all tags in the database for a guild
	 * @param this
	 * @param guildId
	 * @returns
	 */
	public static async GetJam(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string): Promise<CodeJamTypegooseSchema | null> {
		return (await this.findOne({ guild_id: guildId })) ?? null;
	}

	/**
	 * Gets the jam role for a guild
	 * @param this
	 * @param guildId
	 * @returns
	 */
	public static async GetJamRole(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string): Promise<string | null> {
		return await this.findOne({ guild_id: guildId }).then((res) => (res ? (res.event_role_id ? res.event_role_id : null) : null));
	}

	/**
	 * Gets the current code jam participants for a guild
	 * @param this
	 * @param guildId
	 * @returns
	 */
	public static async GetJamParticipants(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string): Promise<string[] | null> {
		return await this.findOne({ guild_id: guildId }).then((res) =>
			res ? (res.event_participants_ids ? res.event_participants_ids : null) : null
		);
	}

	public static async GetJamManagers(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string): Promise<string[] | null> {
		return await this.findOne({ guild_id: guildId }).then((res) => (res ? (res.event_managers_ids ? res.event_managers_ids : null) : null));
	}

	/**
	 * Checks if a jam exists in the database for a guild
	 * @param this
	 * @param guildId
	 * @returns
	 */
	public static async CheckIfJamExist(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string): Promise<boolean> {
		return (await this.findOne({ guild_id: guildId })) ? true : false;
	}

	public static async UpdateJamName(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string, name: string): Promise<boolean> {
		return await this.updateOne(
			{ guild_id: guildId },
			{
				$set: {
					name: name
				}
			},
			{
				upsert: true,
				new: true
			}
		).then((res) => (res.acknowledged ? true : false));
	}

	public static async UpdateJamDescription(
		this: ReturnModelType<typeof CodeJamTypegooseSchema>,
		guildId: string,
		description: string
	): Promise<boolean> {
		return await this.updateOne(
			{ guild_id: guildId },
			{
				$set: {
					description: description
				}
			},
			{
				upsert: true,
				new: true
			}
		).then((res) => (res.acknowledged ? true : false));
	}

	public static async updateCodeJamImage(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string, image: string): Promise<boolean> {
		return await this.updateOne(
			{ guild_id: guildId },
			{
				$set: {
					event_image_url: image
				}
			},
			{
				upsert: true,
				new: true
			}
		).then((res) => (res.acknowledged ? true : false));
	}

	public static async updateCodeJamRole(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string, role: string): Promise<boolean> {
		return await this.updateOne({ guild_id: guildId }, { $set: { event_role_id: role } }, { upsert: true, new: true }).then((res) =>
			res.acknowledged ? true : false
		);
	}

	public static async updateCodeJamRoleManagers(
		this: ReturnModelType<typeof CodeJamTypegooseSchema>,
		guildId: string,
		role: string
	): Promise<boolean> {
		return await this.updateOne({ guild_id: guildId }, { $set: { event_role_managers_id: role } }, { upsert: true, new: true }).then((res) =>
			res.acknowledged ? true : false
		);
	}

	public static async updateCodeJamChannel(
		this: ReturnModelType<typeof CodeJamTypegooseSchema>,
		guildId: string,
		channel: string
	): Promise<boolean> {
		return await this.updateOne({ guild_id: guildId }, { $set: { event_channel_id: channel } }, { upsert: true, new: true }).then((res) =>
			res.acknowledged ? true : false
		);
	}

	public static async updateCodeJamStartTime(
		this: ReturnModelType<typeof CodeJamTypegooseSchema>,
		guildId: string,
		time: string
	): Promise<boolean> {
		return await this.updateOne({ guild_id: guildId }, { $set: { event_start_time: time } }, { upsert: true, new: true }).then((res) =>
			res.acknowledged ? true : false
		);
	}

	public static async updateCodeJamEndTime(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string, time: string): Promise<boolean> {
		return await this.updateOne({ guild_id: guildId }, { $set: { event_end_time: time } }, { upsert: true, new: true }).then((res) =>
			res.acknowledged ? true : false
		);
	}

	public static async updateCodeJamEntity(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string, entity: string): Promise<boolean> {
		return await this.updateOne({ guild_id: guildId }, { $set: { event_entity: entity } }, { upsert: true, new: true }).then((res) =>
			res.acknowledged ? true : false
		);
	}

	public static async AddJamParticipant(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string, userId: string): Promise<boolean> {
		return await this.updateOne({ guild_id: guildId }, { $push: { event_participants_ids: userId } }, { upsert: true, new: true }).then((res) =>
			res.acknowledged ? true : false
		);
	}

	public static async RemoveJamParticipant(
		this: ReturnModelType<typeof CodeJamTypegooseSchema>,
		guildId: string,
		userId: string
	): Promise<boolean> {
		return await this.updateOne({ guild_id: guildId }, { $pull: { event_participants_ids: userId } }, { upsert: true, new: true }).then((res) =>
			res.acknowledged ? true : false
		);
	}

	public static async AddJamManager(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string, userId: string): Promise<boolean> {
		return await this.updateOne({ guild_id: guildId }, { $push: { event_managers_ids: userId } }, { upsert: true, new: true }).then((res) =>
			res.acknowledged ? true : false
		);
	}

	public static async RemoveJamManager(this: ReturnModelType<typeof CodeJamTypegooseSchema>, guildId: string, userId: string): Promise<boolean> {
		return await this.updateOne({ guild_id: guildId }, { $pull: { event_managers_ids: userId } }, { upsert: true, new: true }).then((res) =>
			res.acknowledged ? true : false
		);
	}
}

export const CodeJamModel = getModelForClass(CodeJamTypegooseSchema);
