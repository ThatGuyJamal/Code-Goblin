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
import { container } from '@sapphire/framework';
import { configValues } from '../../../config';
import { Client, Collection } from 'discord.js';

type CacheSearch = {
	guild_id: string;
	user_id: string;
};

type UpdateReputationResult = {
	rankUp: boolean;
};

type UpdateReputationRankResult = {
	success: boolean;
	reputation_rank: number;
};

type SetReputationResult = {
	success: boolean;
	reputation: number;
};

type SetReputationRankResult = {
	success: boolean;
	reputation_rank: number;
};

type SubtractReputationResult = {
	success: boolean;
	reputation: number;
};

type SubtractReputationRankResult = {
	success: boolean;
	reputation_rank: number;
};

type GetReputationLeaderboardResult = {
	success: boolean;
	reputation_leaderboard: UserReputation[];
};

type GetReputationResult = {
	success: boolean;
	reputation: number;
};

@ModelOptions({
	schemaOptions: {
		collection: 'reputation',
		timestamps: true,
		autoIndex: true
	}
})
class UserReputation {
	@prop({ type: String })
	user_id?: string;
	@prop({ type: String })
	guild_id?: string;
	@prop({ type: Number, default: 0 })
	reputation?: number;
	@prop({ type: Number, default: 0 })
	reputation_rank?: number;

	private static caching: boolean = configValues.caching.user_reputation;
	private static cache: Collection<CacheSearch, UserReputation> = new Collection();

	static async initCache() {
		if (!this.caching) return;
		const configs = await UserReputationModel.find();
		for (const config of configs) {
			this.cache.set(
				{
					guild_id: config.guild_id!,
					user_id: config.user_id!
				},
				config
			);
		}

		container.logger.debug('UserReputation Cache', `Loaded ${this.cache.size} server configs into cache.`);
	}

	/**
	 * Create a reputation for a user.
	 * @param guildId
	 * @param userId
	 * @param data
	 * @constructor
	 */
	public static async CreateReputation(
		this: ReturnModelType<typeof UserReputation>,
		guildId: string,
		userId: string,
		data: UserReputation
	): Promise<boolean> {
		// If the reputation already exists, we don't need to create them again.
		const exist = await this.GetReputation(guildId, userId);
		if (exist) return false;

		if (this.caching)
			this.cache.set(
				{
					guild_id: guildId,
					user_id: userId
				},
				data
			);
		return await this.create(data)
			.then(() => {
				container.logger.debug(`[Reputation CREATE USER]`, `Created reputation for user ${userId}`);
				return true;
			})
			.catch(() => {
				container.logger.debug(`[Reputation CREATE USER]`, `Failed to create reputation for user ${userId}`);
				return false;
			});
	}

	/**
	 * Gets the current reputation for a user.
	 * @param guildId
	 * @param userId
	 * @constructor
	 */
	public static async GetReputation(this: ReturnModelType<typeof UserReputation>, guildId: string, userId: string): Promise<UserReputation | null> {
		if (this.caching) {
			container.logger.debug(`[Reputation GET USER]`, `Getting reputation for user ${userId} from cache`);
			return (
				this.cache.get({
					guild_id: guildId,
					user_id: userId
				}) ?? null
			);
		}
		container.logger.debug(`[Reputation GET USER]`, `Getting reputation for user ${userId} from database`);
		return (await this.findOne({ user_id: userId, guild_id: guildId })) ?? null;
	}

	/**
	 * Deletes the reputation for a user.
	 * @param guildId
	 * @param userId
	 * @constructor
	 */
	public static async DeleteReputation(this: ReturnModelType<typeof UserReputation>, guildId: string, userId: string): Promise<boolean> {
		if (this.caching) {
			container.logger.debug(`[Reputation DELETE USER]`, `Deleting reputation for user ${userId} from cache`);
			this.cache.delete({
				guild_id: guildId,
				user_id: userId
			});
		}
		return await this.deleteOne({ user_id: userId, guild_id: guildId })
			.then(() => {
				container.logger.debug(`[Reputation DELETE USER]`, `Deleted reputation for user ${userId}`);
				return true;
			})
			.catch(() => {
				container.logger.debug(`[Reputation DELETE USER]`, `Failed to delete reputation for user ${userId}`);
				return false;
			});
	}

	/**
	 * Updates the reputation for a user by a certain amount.
	 * @param guildId
	 * @param userId
	 * @param amount
	 * @constructor
	 */
	public static async ProcessReputation(
		this: ReturnModelType<typeof UserReputation>,
		guildId: string,
		userId: string,
		amount: number
	): Promise<UpdateReputationResult> {
		if (this.caching) {
			container.logger.debug(`[Reputation PROCESS CACHE]`, `Updating reputation for user ${userId} from cache`);
			const rep = this.cache.get({
				guild_id: guildId,
				user_id: userId
			});

			if (!rep) {
				return await this.CreateReputation(guildId, userId, {
					guild_id: guildId,
					user_id: userId,
					reputation: amount,
					reputation_rank: Math.floor(0.1 * Math.sqrt(amount))
				})
					.then(() => {
						container.logger.debug(`[Reputation PROCESS CACHE]`, `No User found! Created reputation for user ${userId}`);
						return {
							rankUp: Math.floor(0.1 * Math.sqrt(amount)) > 0
						};
					})
					.catch(() => {
						container.logger.debug(`[Reputation PROCESS CACHE]`, `No User found! Failed to create reputation for user ${userId}`);
						return {
							rankUp: false
						};
					});
			}

			rep.reputation = amount;
			rep.reputation_rank = Math.floor(0.1 * Math.sqrt(rep.reputation));

			this.cache.set(
				{
					guild_id: guildId,
					user_id: userId
				},
				rep
			);

			const rep2 = await this.GetReputation(guildId, userId);

			if (!rep2) {
				return await this.CreateReputation(guildId, userId, {
					guild_id: guildId,
					user_id: userId,
					reputation: amount,
					reputation_rank: Math.floor(0.1 * Math.sqrt(amount))
				})
					.then(() => {
						container.logger.debug(`[Reputation PROCESS USER]`, `No User found! Created reputation for user ${userId}`);
						return {
							rankUp: Math.floor(0.1 * Math.sqrt(amount)) > 0
						};
					})
					.catch(() => {
						container.logger.debug(`[Reputation PROCESS USER]`, `No User found! Failed to create reputation for user ${userId}`);
						return {
							rankUp: false
						};
					});
			}

			rep2.reputation! += amount; // this will never be null because it defaults to 0 in the database
			rep2.reputation_rank = Math.floor(0.1 * Math.sqrt(rep2.reputation!));

			// save the rep
			await this.updateOne(
				{
					user_id: userId,
					guild_id: guildId
				},
				{
					reputation: rep2.reputation,
					reputation_rank: rep2.reputation_rank
				},
				{
					upsert: true,
					new: true
				}
			);

			return {
				// Math.floor(0.1 * Math.sqrt(amount)) > 0;
				rankUp: Math.floor(0.1 * Math.sqrt(rep2.reputation!)) > Math.floor(0.1 * Math.sqrt(rep2.reputation! - amount))
			};
		}

		const rep = await this.GetReputation(guildId, userId);

		if (!rep) {
			return await this.CreateReputation(guildId, userId, {
				guild_id: guildId,
				user_id: userId,
				reputation: amount,
				reputation_rank: Math.floor(0.1 * Math.sqrt(amount))
			})
				.then(() => {
					container.logger.debug(`[Reputation PROCESS USER]`, `No User found! Created reputation for user ${userId}`);
					return {
						rankUp: Math.floor(0.1 * Math.sqrt(amount)) > 0
					};
				})
				.catch(() => {
					container.logger.debug(`[Reputation PROCESS USER]`, `No User found! Failed to create reputation for user ${userId}`);
					return {
						rankUp: false
					};
				});
		}

		rep.reputation! += amount; // this will never be null because it defaults to 0 in the database
		rep.reputation_rank = Math.floor(0.1 * Math.sqrt(rep.reputation!));

		// save the rep
		await this.updateOne(
			{
				user_id: userId,
				guild_id: guildId
			},
			{
				reputation: rep.reputation,
				reputation_rank: rep.reputation_rank
			},
			{
				upsert: true,
				new: true
			}
		);

		return {
			// Math.floor(0.1 * Math.sqrt(amount)) > 0;
			rankUp: Math.floor(0.1 * Math.sqrt(rep.reputation!)) > Math.floor(0.1 * Math.sqrt(rep.reputation! - amount))
		};
	}

	/**
	 * Updates the reputation rank for a user by a certain amount.
	 * @param guildId
	 * @param userId
	 * @param amount
	 * @constructor
	 */
	public static async ProcessReputationRank(
		this: ReturnModelType<typeof UserReputation>,
		guildId: string,
		userId: string,
		amount: number
	): Promise<UpdateReputationRankResult> {
		if (this.caching) {
			container.logger.debug(`[Reputation RANK PROCESS USER CACHE]`, `Updating reputation for user ${userId} from cache`);
			const rep = this.cache.get({
				guild_id: guildId,
				user_id: userId
			});

			if (!rep) {
				container.logger.debug(`[Reputation RANK PROCESS CACHE]`, `No user found! Failed to update reputation rank for user ${userId}`);
				return {
					success: false,
					reputation_rank: 0
				};
			}

			rep.reputation_rank! += amount;
			rep.reputation = rep.reputation_rank! * rep.reputation_rank! * 100;

			this.cache.set(
				{
					guild_id: guildId,
					user_id: userId
				},
				rep
			);

			const rep2 = await this.GetReputation(guildId, userId);

			if (!rep2) {
				container.logger.debug(`[Reputation RANK PROCESS]`, `No user found! Failed to update reputation rank for user ${userId}`);
				return {
					success: false,
					reputation_rank: 0
				};
			}

			rep2.reputation_rank! += amount;
			rep2.reputation = rep.reputation_rank! * rep2.reputation_rank! * 100;

			return await this.updateOne(
				{
					user_id: userId,
					guild_id: guildId
				},
				{
					set: {
						reputation_rank: rep2.reputation_rank,
						reputation: rep2.reputation
					}
				},
				{
					upsert: true,
					new: true
				}
			)
				.then(() => {
					container.logger.debug(`[Reputation RANK PROCESS]`, `Updated reputation rank for user ${userId}`);
					return {
						success: true,
						reputation_rank: rep2.reputation_rank!
					};
				})
				.catch(() => {
					container.logger.debug(`[Reputation RANK PROCESS]`, `Failed to update reputation rank for user ${userId}`);
					return {
						success: false,
						reputation_rank: 0
					};
				});
		}

		const rep = await this.GetReputation(guildId, userId);

		if (!rep) {
			container.logger.debug(`[Reputation RANK PROCESS]`, `No user found! Failed to update reputation rank for user ${userId}`);
			return {
				success: false,
				reputation_rank: 0
			};
		}

		rep.reputation_rank! += amount;
		rep.reputation = rep.reputation_rank! * rep.reputation_rank! * 100;

		return await this.updateOne(
			{
				user_id: userId,
				guild_id: guildId
			},
			{
				set: {
					reputation_rank: rep.reputation_rank,
					reputation: rep.reputation
				}
			},
			{
				upsert: true,
				new: true
			}
		)
			.then(() => {
				container.logger.debug(`[Reputation RANK PROCESS]`, `Updated reputation rank for user ${userId}`);
				return {
					success: true,
					reputation_rank: rep.reputation_rank!
				};
			})
			.catch(() => {
				container.logger.debug(`[Reputation RANK PROCESS]`, `Failed to update reputation rank for user ${userId}`);
				return {
					success: false,
					reputation_rank: 0
				};
			});
	}

	public static async GiveReputation(
		this: ReturnModelType<typeof UserReputation>,
		guildId: string,
		userId: string,
		amount: number
	): Promise<GetReputationResult> {
		if (this.caching) {
		}

		const rep = await this.GetReputation(guildId, userId);

		if (!rep) {
			container.logger.debug(`[Reputation GIVE]`, `No user found! Failed to give reputation to user ${userId}`);
			return {
				success: false,
				reputation: 0
			};
		}

		return await this.updateOne(
			{
				guild_id: guildId,
				user_id: userId
			},
			{
				$set: {
					reputation: rep.reputation! + amount
				}
			},
			{
				upsert: true,
				new: true
			}
		)
			.then(() => {
				container.logger.debug(`[Reputation GIVE]`, `Gave reputation to user ${userId}`);
				return {
					success: true,
					reputation: rep.reputation! + amount
				};
			})
			.catch(() => {
				container.logger.debug(`[Reputation GIVE]`, `Failed to give reputation to user ${userId}`);
				return {
					success: false,
					reputation: 0
				};
			});
	}

	/**
	 * Sets a user's reputation to a certain amount. (overwrites past reputation)
	 * @param guildId
	 * @param userId
	 * @param amount
	 * @constructor
	 */
	public static async SetReputation(
		this: ReturnModelType<typeof UserReputation>,
		guildId: string,
		userId: string,
		amount: number
	): Promise<SetReputationResult> {
		if (this.caching) {
			const rep = this.cache.get({
				guild_id: guildId,
				user_id: userId
			});

			if (!rep) {
				container.logger.debug(`[Reputation SET CACHE]`, `No user found! Failed to set reputation for user ${userId}`);
				return {
					success: false,
					reputation: 0
				};
			}

			rep.reputation = amount;
			rep.reputation_rank = Math.floor(0.1 * Math.sqrt(rep.reputation));

			this.cache.set(
				{
					guild_id: guildId,
					user_id: userId
				},
				rep
			);
		}

		const rep = await this.GetReputation(guildId, userId);

		if (!rep) {
			container.logger.debug(`[Reputation SET]`, `No user found! Failed to set reputation for user ${userId}`);
			return {
				success: false,
				reputation: 0
			};
		}

		rep.reputation = amount;
		rep.reputation_rank = Math.floor(0.1 * Math.sqrt(rep.reputation));

		return await this.updateOne(
			{
				user_id: userId,
				guild_id: guildId
			},
			{
				$set: {
					reputation: rep.reputation,
					reputation_rank: rep.reputation_rank
				}
			},
			{
				upsert: true,
				new: true
			}
		)
			.then(() => {
				container.logger.debug(`[Reputation SET]`, `Set reputation for user ${userId}`);
				return {
					success: true,
					reputation: rep.reputation!
				};
			})
			.catch(() => {
				container.logger.debug(`[Reputation SET]`, `Failed to set reputation for user ${userId}`);
				return {
					success: false,
					reputation: 0
				};
			});
	}

	/**
	 * Sets a user's reputation rank to a certain amount. (overwrites past reputation rank)
	 * @param guildId
	 * @param userId
	 * @param amount
	 * @constructor
	 */
	public static async SetReputationRank(
		this: ReturnModelType<typeof UserReputation>,
		guildId: string,
		userId: string,
		amount: number
	): Promise<SetReputationRankResult> {
		if (this.caching) {
			const rep = this.cache.get({
				guild_id: guildId,
				user_id: userId
			});

			if (!rep) {
				container.logger.debug(`[Reputation RANK SET CACHE]`, `No user found! Failed to set reputation rank for user ${userId}`);
				return {
					success: false,
					reputation_rank: 0
				};
			}

			rep.reputation_rank = amount;
			rep.reputation = rep.reputation! * rep.reputation! * 100;

			this.cache.set(
				{
					guild_id: guildId,
					user_id: userId
				},
				rep
			);
		}

		const rep = await this.GetReputation(guildId, userId);

		if (!rep) {
			container.logger.debug(`[Reputation RANK SET]`, `No user found! Failed to set reputation rank for user ${userId}`);
			return {
				success: false,
				reputation_rank: 0
			};
		}

		rep.reputation_rank = amount;
		rep.reputation = rep.reputation! * rep.reputation! * 100;

		return await this.updateOne(
			{
				user_id: userId,
				guild_id: guildId
			},
			{
				$set: {
					reputation_rank: rep.reputation_rank,
					reputation: rep.reputation
				}
			},
			{
				upsert: true,
				new: true
			}
		)
			.then(() => {
				container.logger.debug(`[Reputation RANK SET]`, `Set reputation rank for user ${userId}`);
				return {
					success: true,
					reputation_rank: rep.reputation_rank!
				};
			})
			.catch(() => {
				container.logger.debug(`[Reputation RANK SET]`, `Failed to set reputation rank for user ${userId}`);
				return {
					success: false,
					reputation_rank: 0
				};
			});
	}

	/**
	 * Removes a certain amount of reputation from a user.
	 * @param guildId
	 * @param userId
	 * @param amount
	 * @constructor
	 */

	public static async UnsetReputation(
		this: ReturnModelType<typeof UserReputation>,
		guildId: string,
		userId: string,
		amount: number
	): Promise<SubtractReputationResult> {
		if (this.caching) {
			const rep = this.cache.get({
				guild_id: guildId,
				user_id: userId
			});

			if (!rep) {
				container.logger.debug(`[Reputation UNSET CACHE]`, `No user found! Failed to unset reputation for user ${userId}`);
				return {
					success: false,
					reputation: 0
				};
			}

			rep.reputation! -= amount;
			rep.reputation_rank = Math.floor(0.1 * Math.sqrt(rep.reputation!));

			this.cache.set(
				{
					guild_id: guildId,
					user_id: userId
				},
				rep
			);
		}

		const rep = await this.GetReputation(guildId, userId);

		if (!rep) {
			container.logger.debug(`[Reputation UNSET]`, `No user found! Failed to unset reputation for user ${userId}`);
			return {
				success: false,
				reputation: 0
			};
		}

		rep.reputation! -= amount;
		rep.reputation_rank = Math.floor(0.1 * Math.sqrt(rep.reputation!));

		return await this.updateOne(
			{
				user_id: userId,
				guild_id: guildId
			},
			{
				$set: {
					reputation: rep.reputation,
					reputation_rank: rep.reputation_rank
				}
			},
			{
				upsert: true,
				new: true
			}
		)
			.then(() => {
				container.logger.debug(`[Reputation UNSET]`, `Unset reputation for user ${userId}`);
				return {
					success: true,
					reputation: rep.reputation!
				};
			})
			.catch(() => {
				container.logger.debug(`[Reputation UNSET]`, `Failed to unset reputation for user ${userId}`);
				return {
					success: false,
					reputation: 0
				};
			});
	}

	public static async UnsetReputationRank(
		this: ReturnModelType<typeof UserReputation>,
		guildId: string,
		userId: string,
		amount: number
	): Promise<SubtractReputationRankResult> {
		if (this.caching) {
			const rep = this.cache.get({
				guild_id: guildId,
				user_id: userId
			});

			if (!rep) {
				container.logger.debug(`[Reputation RANK UNSET CACHE]`, `No user found! Failed to unset reputation rank for user ${userId}`);
				return {
					success: false,
					reputation_rank: 0
				};
			}

			rep.reputation_rank! -= amount;
			rep.reputation = rep.reputation! * rep.reputation! * 100;

			this.cache.set(
				{
					guild_id: guildId,
					user_id: userId
				},
				rep
			);
		}

		const rep = await this.GetReputation(guildId, userId);

		if (!rep) {
			container.logger.debug(`[Reputation RANK UNSET]`, `No user found! Failed to unset reputation rank for user ${userId}`);
			return {
				success: false,
				reputation_rank: 0
			};
		}

		rep.reputation_rank! -= amount;
		rep.reputation = rep.reputation! * rep.reputation! * 100;

		return await this.updateOne(
			{
				user_id: userId,
				guild_id: guildId
			},
			{
				$set: {
					reputation_rank: rep.reputation_rank,
					reputation: rep.reputation
				}
			},
			{
				upsert: true,
				new: true
			}
		)
			.then(() => {
				container.logger.debug(`[Reputation RANK UNSET]`, `Unset reputation rank for user ${userId}`);
				return {
					success: true,
					reputation_rank: rep.reputation_rank!
				};
			})
			.catch(() => {
				container.logger.debug(`[Reputation RANK UNSET]`, `Failed to unset reputation rank for user ${userId}`);
				return {
					success: false,
					reputation_rank: 0
				};
			});
	}

	public static async GetReputationLeaderboard(
		this: ReturnModelType<typeof UserReputation>,
		guildId: string,
		limit?: number
	): Promise<GetReputationLeaderboardResult> {
		if (!limit) limit = 10;

		// Sorts by reputation in descending order
		const result = await this.find({
			guild_id: guildId
		})
			.sort({
				reputation: -1
			})
			.limit(limit)
			.exec();

		if (!result) {
			container.logger.debug(`[Reputation LEADERBOARD]`, `Failed to get reputation leaderboard for guild ${guildId}`);
			return {
				success: false,
				reputation_leaderboard: []
			};
		}

		container.logger.debug(`[Reputation LEADERBOARD]`, `Got reputation leaderboard for guild ${guildId}`);
		return {
			success: true,
			reputation_leaderboard: result as any // TODO: Fix this
		};
	}

	public static async ComputeReputationLeaderboard(
		this: ReturnModelType<typeof UserReputation>,
		client: Client,
		leaderboard: UserReputation[],
		fetchUsers = false
	) {
		if (leaderboard.length < 1) return [];

		const computedArray = [];

		if (fetchUsers) {
			for (const key of leaderboard) {
				const user = (await client.users.fetch(key.user_id!)) || { username: 'Unknown', discriminator: '0000' };
				computedArray.push({
					guild_id: key.guild_id,
					user_id: key.user_id,
					reputation: key.reputation,
					reputation_rank: key.reputation_rank,
					position: leaderboard.findIndex((i) => i.guild_id === key.guild_id && i.user_id === key.user_id) + 1,
					tag: user.tag
				});
			}
		} else {
			for (const key of leaderboard) {
				computedArray.push({
					guild_id: key.guild_id,
					user_id: key.user_id,
					reputation: key.reputation,
					reputation_rank: key.reputation_rank,
					position: leaderboard.findIndex((i) => i.guild_id === key.guild_id && i.user_id === key.user_id) + 1,
					tag: client.users.cache.get(key.user_id!)?.tag || 'Unknown#0000'
				});
			}
		}

		return computedArray;
	}

	/**
	 * Gets the required reputation for a certain rank
	 * @param rank The rank to get the reputation for
	 * @constructor
	 */
	public static GetReputationRankFor(this: ReturnModelType<typeof UserReputation>, rank: number): number {
		return rank * rank * 100;
	}
}

export const UserReputationModel = getModelForClass(UserReputation);
