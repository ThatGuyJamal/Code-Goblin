import type { Model } from 'mongoose';
import { Collection } from 'oceanic.js';
import config from '../../../config/config.js';
import type Main from '../../../core/main.js';
import type { PremiumUserLevels, PremiumUserSchema } from '../../../typings/database/types';

export class PremiumUserCommandController {
	private instance: Main;
	// Cache of all tags mapped by guildId
	public cache: Collection<string, PremiumUserSchema>;

	private cachingDisabled: boolean;

	public query: Model<PremiumUserSchema, {}, {}, {}, any>;

	public constructor(i: Main) {
		this.instance = i;
		this.cache = new Collection();
		this.query = this.instance.database.schemas.premiumUser;
		this.cachingDisabled = config.cacheDisabled.premium_users;

		this.init();
	}

	public async init(): Promise<void> {
		if (this.cachingDisabled) return;

		// Load all tags into cache
		const premium = await this.query.find();

		for (const data of premium) {
			this.cache.set(data.user_id, data);
		}
	}

	/**
	 * Creates a premium user in the database
	 * @param user_id
	 * @param activated
	 * @param activated_at
	 * @param expires_at
	 * @param level
	 * @returns
	 */
	public async CreatePremiumUser({ user_id, activated, activated_at, expires_at, level }: PremiumUserSchema): Promise<PremiumUserSchema> {
		const data = {
			user_id,
			activated,
			activated_at,
			expires_at,
			level
		} as PremiumUserSchema;

		if (!this.cachingDisabled) this.cache.set(user_id, data);

		return await this.query.create(data);
	}

	/**
	 * Gets a premium user from the database
	 * @param userId
	 * @returns
	 */
	public async GetPremiumUser(userId: string): Promise<PremiumUserSchema | null> {
		if (!this.cachingDisabled) {
			const cached = this.cache.get(userId);

			if (cached) return cached ?? null;
		}

		return (await this.query.findOne({ user_id: userId })) ?? null;
	}

	/** Updates a premium user document */
	public async UpdatePremiumUser({
		userId,
		activated,
		level,
		expires_at
	}: {
		userId: string;
		activated?: boolean;
		level?: PremiumUserLevels;
		expires_at?: Date;
	}) {
		const result = await this.query.findOneAndUpdate(
			{ user_id: userId },
			{
				$set: {
					activated,
					level,
					expires_at
				}
			},
			{
				upsert: true,
				new: true
			}
		);

		if (!this.cachingDisabled) this.cache.set(userId, result);
	}

	/**
	 * Deletes a premium user from the database
	 * @param userId
	 * @returns {Boolean} Whether the user was deleted or not
	 */
	public async DeletePremiumUser(userId: string): Promise<boolean> {
		if (!this.cachingDisabled) {
			if (this.cache.has(userId)) this.cache.delete(userId);
			else return false;
		}

		const d = await this.query.deleteOne({ user_id: userId });

		if (!d.acknowledged) return false;

		return true;
	}

	/**
	 * Checks if a user is a premium user
	 * @param userId
	 */
	public async isPremiumUser(userId: string): Promise<boolean> {
		const user = await this.GetPremiumUser(userId);

		if (!user) return false;

		return user.activated;
	}

	public async getAllPremiumUsers(): Promise<PremiumUserSchema[] | null> {
		if (!this.cachingDisabled) {
			// Loop through cache and return all premium users
			const premiumUsers: PremiumUserSchema[] = [];

			for (const user of this.cache.values()) {
				if (user.activated) premiumUsers.push(user);
			}

			if (premiumUsers.length === 0) return null;

			return premiumUsers;
		}

		return (await this.query.find({ activated: true })) ?? null;
	}
}
