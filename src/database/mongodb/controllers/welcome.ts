import type { Model } from 'mongoose';
import { Collection } from 'oceanic.js';

import config from '../../../config/config.js';
import type Main from '../../../core/main.js';
import type { ContentType, WelcomeSchema } from '../../../typings/database/types.js';

export class WelcomeCommandController {
	private instance: Main;
	// Cache of all tags mapped by guildId
	public cache: Collection<string, WelcomeSchema>;

	private cachingDisabled: boolean;

	public query: Model<WelcomeSchema, {}, {}, {}, any>;

	public constructor(i: Main) {
		this.instance = i;
		this.cache = new Collection();
		this.query = this.instance.database.schemas.welcome;
		this.cachingDisabled = config.cacheDisabled.welcome;

		this.init();
	}

	public async init(): Promise<void> {
		if (this.cachingDisabled) return;

		// Load all tags into cache
		const welcome = await this.query.find();

		for (const data of welcome) {
			this.cache.set(data.guild_id, data);
		}
	}

	/**
	 * Creates a welcome message for a guild
	 * @param guildId
	 * @param channelId
	 * @param contentType
	 * @param content
	 * @param enabled
	 * @returns
	 */
	public async CreateWelcome(
		guildId: string,
		channelId: string,
		contentType: ContentType,
		content: string,
		enabled: boolean
	): Promise<WelcomeSchema> {
		const data = {
			guild_id: guildId,
			channel_id: channelId,
			content_type: contentType,
			content: content,
			enabled: enabled
		} as WelcomeSchema;

		if (!this.cachingDisabled) this.cache.set(guildId, data);

		return await this.query.create(data);
	}

	/**
	 * Updates a welcome message for a guild
	 * @param guildId
	 * @param channelId
	 * @param contentType
	 * @param content
	 * @param enabled
	 * @returns
	 */
	public async UpdateWelcome(
		guildId: string,
		channelId: string,
		contentType: ContentType,
		content: string,
		enabled: boolean
	): Promise<WelcomeSchema> {
		const welcome = await this.query.findOneAndUpdate(
			{
				guild_id: guildId
			},
			{
				guild_id: guildId,
				channel_id: channelId,
				content_type: contentType,
				content: content,
				enabled: enabled
			},
			{
				new: true,
				upsert: true
			}
		);

		if (!this.cachingDisabled) this.cache.set(guildId, welcome);

		return welcome;
	}

	/**
	 * Deletes a welcome message for a guild
	 * @param guildId
	 */
	public async DeleteWelcome(guildId: string): Promise<boolean> {
		if (!await this.GetWelcome(guildId)) return false;

		if (!this.cachingDisabled) this.cache.delete(guildId);

		await this.query.deleteOne({ guild_id: guildId });

		return true;
	}

	/**
	 * Gets the welcome message for a guild
	 * @param guildId
	 * @returns
	 */
	public async GetWelcome(guildId: string): Promise<WelcomeSchema | null> {
		if (!this.cachingDisabled) return this.cache.get(guildId) ?? null;

		return await this.query.findOne({ guild_id: guildId });
	}
}
