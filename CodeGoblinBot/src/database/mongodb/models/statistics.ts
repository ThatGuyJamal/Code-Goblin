import { getModelForClass, ModelOptions, prop, ReturnModelType } from '@typegoose/typegoose';

@ModelOptions({
	schemaOptions: {
		collection: 'global-statistics',
		timestamps: true,
		autoIndex: true
	}
})
class Statistics {
	@prop({ type: String })
	find_id?: string;

	@prop({ type: Number })
	guilds_joined?: number;

	@prop({ type: Number })
	guilds_left?: number;

	@prop({ type: Number })
	commands_executed?: number;

	@prop({ type: Number })
	commands_failed?: number;

	public static async UpdateGuildsJoined(this: ReturnModelType<typeof Statistics>) {
		await this.updateOne(
			{ find_id: 'global' },
			{ $inc: { guilds_joined: 1 } },
			{
				upsert: true,
				new: true
			}
		);
	}

	public static async UpdateGuildsLeft(this: ReturnModelType<typeof Statistics>) {
		await this.updateOne(
			{ find_id: 'global' },
			{ $inc: { guilds_left: 1 } },
			{
				upsert: true,
				new: true
			}
		);
	}

	public static async UpdateCommandsExecuted(this: ReturnModelType<typeof Statistics>) {
		await this.updateOne(
			{ find_id: 'global' },
			{ $inc: { commands_executed: 1 } },
			{
				upsert: true,
				new: true
			}
		);
	}

	public static async UpdateCommandsFailed(this: ReturnModelType<typeof Statistics>) {
		await this.updateOne(
			{ find_id: 'global' },
			{ $inc: { commands_failed: 1 } },
			{
				upsert: true,
				new: true
			}
		);
	}
}

export const GlobalStatsModel = getModelForClass(Statistics);
