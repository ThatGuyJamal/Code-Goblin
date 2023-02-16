import { getModelForClass, ModelOptions, prop, ReturnModelType } from '@typegoose/typegoose';

export interface PremiumUserSchema {
	user_id: string;
	activated: boolean;
	activated_at: number | null;
	/** Some users can have lifetime access */
	expires_at: Number | null;
	level: PremiumUserLevels | null;
}

export enum PremiumUserLevels {
	LIFE_TIME = 'lifetime',
	MONTHLY = 'monthly',
	YEARLY = 'yearly'
}

@ModelOptions({
	schemaOptions: {
		collection: 'premium-users',
		timestamps: true,
		autoIndex: true
	}
})
class PremiumUser {
	@prop({ type: String, required: true })
	user_id?: string;

	@prop({ type: Boolean, default: false })
	activated?: boolean;

	@prop({ type: Number, default: null })
	activated_at?: number;

	@prop({ type: Number, default: null })
	expires_at?: Number | null;

	@prop({ type: String, default: null })
	level?: PremiumUserLevels;

	/**
	 * Creates a new premium user in the database
	 * @param this
	 * @param data
	 * @returns
	 */
	public static async CreatePremiumUser(this: ReturnModelType<typeof PremiumUser>, data: PremiumUser): Promise<boolean> {
		return await this.create(data)
			.then(() => true)
			.catch(() => false);
	}

	public static async GetPremiumUser(this: ReturnModelType<typeof PremiumUser>, userId: string): Promise<PremiumUser | null> {
		return await this.findOne({ user_id: userId }).exec();
	}

	public static async UpdatePremiumUser(this: ReturnModelType<typeof PremiumUser>, userId: string, data: PremiumUser): Promise<boolean> {
		return await this.updateOne({ user_id: userId }, data).then((res) => (res.acknowledged ? true : false));
	}

	public static async DeletePremiumUser(this: ReturnModelType<typeof PremiumUser>, userId: string): Promise<boolean> {
		return await this.deleteOne({ user_id: userId }).then((res) => (res.acknowledged ? true : false));
	}

	public static async GetPremiumUsers(this: ReturnModelType<typeof PremiumUser>): Promise<PremiumUser[]> {
		return await this.find().exec();
	}

	public static async GetPremiumUsersCount(this: ReturnModelType<typeof PremiumUser>): Promise<number> {
		return await this.countDocuments().exec();
	}

	public static async CheckIfPremiumUser(this: ReturnModelType<typeof PremiumUser>, userId: string): Promise<boolean> {
		return (await this.exists({ user_id: userId }).exec()) ? true : false;
	}
}

export const PremiumUserModel = getModelForClass(PremiumUser);
