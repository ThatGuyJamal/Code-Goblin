import { Collection } from 'oceanic.js';
import type { CommandCooldown } from '../cmd/command.js';
import { CooldownModel } from '../database/schemas/cooldown.js';

export enum CooldownDurations {
	SECOND = 1,
	MINUTE = 60,
	HOUR = 3600,
	DAY = 86400
}

export class CooldownCommandPlugin {
	// guild_id-user_id-action_name, expires date
	public cache: Collection<string, Date>;

	constructor() {
		this.cache = new Collection();

		this.init();
	}

	private async init() {
		await CooldownModel.deleteMany({ expires: { $lte: new Date() } });

		const cooldowns = await CooldownModel.find();

		for (const result of cooldowns) {
			const { _id, expires } = result;
			this.cache.set(_id, expires);
		}
	}

	/**
	 * Sets a new cooldown for a user
	 * @param guild_id
	 * @param user_id
	 * @param command_name
	 * @param expires
	 */
	public async set(guild_id: string, user_id: string, command_name: string, data: CommandCooldown) {
		const expires = this.convertTimeToDate(data);

		this.cache.set(`${guild_id}-${user_id}-${command_name}`, expires);

		await CooldownModel.findOneAndUpdate(
			{
				_id: `${guild_id}-${user_id}-${command_name}`
			},
			{
				expires
			},
			{
				upsert: true,
				new: true
			}
		);

		// Delete the cooldown after it expires
		setTimeout(async () => {
			await this.delete(guild_id, user_id, command_name);
		}, expires.getTime());
	}

	/**
	 * Gets the active cooldown for a user
	 * @param guild_id
	 * @param user_id
	 * @param command_name
	 * @returns
	 */
	public get(guild_id: string, user_id: string, command_name: string) {
		return this.cache.get(`${guild_id}-${user_id}-${command_name}`);
	}

	/**
	 * Deletes a cooldown for a user
	 * @param guild_id
	 * @param user_id
	 * @param command_name
	 */
	public async delete(guild_id: string, user_id: string, command_name: string) {
		this.cache.delete(`${guild_id}-${user_id}-${command_name}`);

		await CooldownModel.findOneAndDelete({
			_id: `${guild_id}-${user_id}-${command_name}`
		});
	}

	/** Clears all cooldowns in the collection */
	public async clearCooldownCollection() {
		this.cache.clear();

		await CooldownModel.deleteMany({});
	}

	/**
	 * Clears all cooldowns for a guild
	 * @param guild_id
	 */
	public async clearGuild(guild_id: string) {
		for (const [key, _value] of this.cache) {
			if (key.startsWith(guild_id)) {
				this.cache.delete(key);
			}
		}

		await CooldownModel.deleteMany({ _id: { $regex: `^${guild_id}-` } });
	}

	/**
	 * Clears all cooldowns for a command
	 * @param command_name
	 */
	public async clearCommand(command_name: string) {
		for (const [key, _value] of this.cache) {
			if (key.endsWith(command_name)) {
				this.cache.delete(key);
			}
		}

		await CooldownModel.deleteMany({ _id: { $regex: `-${command_name}$` } });
	}

	/**
	 * Clears a cooldown for a user in a guild for a command
	 * @param guild_id
	 * @param user_id
	 * @param command_name
	 */
	public async clearUserCommand(guild_id: string, user_id: string, command_name: string) {
		this.cache.delete(`${guild_id}-${user_id}-${command_name}`);

		await CooldownModel.findOneAndDelete({
			_id: `${guild_id}-${user_id}-${command_name}`
		});
	}

	/**
	 * Clears all cooldowns for a user in a guild
	 * @param guild_id
	 * @param user_id
	 */
	public async clearUserGuild(guild_id: string, user_id: string) {
		for (const [key, _value] of this.cache) {
			if (key.startsWith(`${guild_id}-${user_id}`)) {
				this.cache.delete(key);
			}
		}

		await CooldownModel.deleteMany({ _id: { $regex: `^${guild_id}-${user_id}-` } });
	}

	/**
	 * Checks if the user is on cooldown for a command
	 * @param guild_id
	 * @param user_id
	 * @param command_name
	 * @returns
	 */
	public isOnCooldown(guild_id: string, user_id: string, command_name: string) {
		const cooldown = this.get(guild_id, user_id, command_name);

		if (!cooldown) return false;

		return cooldown.getTime() > Date.now();
	}

	/**
	 * Gets the remaining cooldown for a user
	 * @param guild_id
	 * @param user_id
	 * @param command_name
	 * @returns
	 */
	public getRemainingCooldown(guild_id: string, user_id: string, command_name: string) {
		const cooldown = this.get(guild_id, user_id, command_name);

		if (!cooldown) return 0;

		return cooldown.getTime() - Date.now();
	}

	// Convert CooldownDurations to Date
	private convertTimeToDate({ duration, multiplier }: CommandCooldown) {
		return new Date(Date.now() + duration * multiplier);
	}
}
