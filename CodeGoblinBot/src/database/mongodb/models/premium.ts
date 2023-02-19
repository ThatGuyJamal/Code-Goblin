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
import { configValues } from '../../../config';
import { Collection } from 'discord.js';
import { container } from '@sapphire/framework';

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

	private static caching: boolean = configValues.caching.premium;
	private static cache: Collection<string, PremiumUser> = new Collection();

	static async initCache() {
		if (!this.caching) return;
		const configs = await PremiumUserModel.find();
		for (const config of configs) {
			this.cache.set(config.user_id!, config);
		}

		container.logger.debug('Premium Cache', `Loaded ${this.cache.size} server configs into cache.`);
	}

	/**
	 * Creates a new premium user in the database
	 * @param data
	 * @returns
	 */
	public static async CreatePremiumUser(this: ReturnModelType<typeof PremiumUser>, data: PremiumUser): Promise<boolean> {
		if (this.caching) this.cache.set(data.user_id!, data);
		return await this.create(data)
			.then((data) => {
				container.logger.debug('Premium', `Created premium user ${data.user_id}`, data);
				return true;
			})
			.catch(() => false);
	}

	public static async GetPremiumUser(this: ReturnModelType<typeof PremiumUser>, userId: string): Promise<PremiumUser | null> {
		if (this.caching) {
			container.logger.debug('Premium CACHE', `Retrieved premium user ${userId} from cache`);
			return this.cache.get(userId) ?? null;
		}

		container.logger.debug('Premium', `Retrieved premium user ${userId} from database`);
		return await this.findOne({ user_id: userId }).exec();
	}

	public static async UpdatePremiumUser(this: ReturnModelType<typeof PremiumUser>, userId: string, data: PremiumUser): Promise<boolean> {
		if (this.caching) {
			const cached = this.cache.get(data.user_id!);
			if (cached) {
				this.cache.set(data.user_id!, { ...cached, ...data });
			} else {
				this.cache.set(data.user_id!, data);
			}
		}
		return await this.updateOne(
			{ user_id: userId },
			{
				$set: {
					activated: data.activated,
					activated_at: data.activated_at,
					expires_at: data.expires_at,
					level: data.level
				}
			},
			{
				upsert: true,
				new: true
			}
		)
			.then((res) => {
				container.logger.debug('Premium', `Updated premium user ${userId}`, data);
				return res.acknowledged;
			})
			.catch(() => {
				container.logger.debug('Premium', `Failed to update premium user ${userId}`, data);
				return false;
			});
	}

	public static async DeletePremiumUser(this: ReturnModelType<typeof PremiumUser>, userId: string): Promise<boolean> {
		if (this.caching) this.cache.delete(userId);
		return await this.deleteOne({ user_id: userId })
			.then((res) => {
				container.logger.debug('Premium CACHE', `Deleted premium user ${userId}`);
				return res.acknowledged;
			})
			.catch(() => {
				container.logger.debug('Premium', `Failed to delete premium user ${userId}`);
				return false;
			});
	}

	public static async GetPremiumUsers(this: ReturnModelType<typeof PremiumUser>): Promise<PremiumUser[]> {
		if (this.caching) {
			container.logger.debug('Premium CACHE', `Retrieved all premium users from cache`);
			return this.cache.map((v) => v);
		}

		container.logger.debug('Premium', `Retrieved all premium users from database`);
		return await this.find().exec();
	}

	public static async GetPremiumUsersCount(this: ReturnModelType<typeof PremiumUser>): Promise<number> {
		if (this.caching) {
			container.logger.debug('Premium CACHE', `Retrieved premium users count from cache`);
			return this.cache.size;
		}

		container.logger.debug('Premium', `Retrieved premium users count from database`);
		return await this.countDocuments().exec();
	}

	public static async CheckIfPremiumUser(this: ReturnModelType<typeof PremiumUser>, userId: string): Promise<boolean> {
		if (this.caching) {
			container.logger.debug('Premium CACHE', `Checked if premium user ${userId} exists in cache`);
			return this.cache.has(userId);
		}

		container.logger.debug('Premium', `Checked if premium user ${userId} exists in database`);
		return !!(await this.exists({ user_id: userId }).exec());
	}
}

export const PremiumUserModel = getModelForClass(PremiumUser);
