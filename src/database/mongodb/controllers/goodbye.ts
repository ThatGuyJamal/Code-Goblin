import { Collection } from 'oceanic.js';
import config from '../../../config/config.js';
import type Main from '../../../core/main.js';
import type { ContentType, GoodbyeSchema } from '../../../typings/database/types.js';

export class GoodbyeCommandController {
	private instance: Main;
	// Cache of all tags mapped by guildId
	public cache: Collection<string, GoodbyeSchema>;
	private cachingDisabled: boolean;

	public query;

	public constructor(i: Main) {
		this.instance = i;
		this.cache = new Collection();
		this.query = this.instance.database.schemas.goodbye;
		this.cachingDisabled = config.cacheDisabled.goodbye;

		this.init();
	}

	public async init(): Promise<void> {
		if (this.cachingDisabled) return;
		// Load all tags into cache
		const goodbye = await this.query.find();

		for (const data of goodbye) {
			this.cache.set(data.guild_id, data);
		}
	}

	/**
	 * Creates a Goodbye message for a guild
	 * @param guildId
	 * @param channelId
	 * @param contentType
	 * @param content
	 * @param enabled
	 * @returns
	 */
	public async CreateGoodbye(
		guildId: string,
		channelId: string,
		contentType: ContentType,
		content: string,
		enabled: boolean
	): Promise<GoodbyeSchema> {
		const data = {
			guild_id: guildId,
			channel_id: channelId,
			content_type: contentType,
			content: content,
			enabled: enabled
		} as GoodbyeSchema;

		// Add the tag to the cache
		if (!this.cachingDisabled) this.cache.set(guildId, data);

		return await this.query.create(data);
	}

	/**
	 * Updates a Goodbye message for a guild
	 * @param guildId
	 * @param channelId
	 * @param contentType
	 * @param content
	 * @param enabled
	 * @returns
	 */
	public async UpdateGoodbye(
		guildId: string,
		channelId: string,
		contentType: ContentType,
		content: string,
		enabled: boolean
	): Promise<GoodbyeSchema> {
		const Goodbye = await this.query.findOneAndUpdate(
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

		if (!this.cachingDisabled) this.cache.set(guildId, Goodbye);

		return Goodbye;
	}

	/**
	 * Deletes a Goodbye message for a guild
	 * @param guildId
	 */
	public async DeleteGoodbye(guildId: string): Promise<boolean> {
		if (!this.GetGoodbye(guildId)) return false;

		if (!this.cachingDisabled) this.cache.delete(guildId);
		await this.query.deleteOne({ guild_id: guildId });

		return true;
	}

	/**
	 * Gets the Goodbye message for a guild
	 * @param guildId
	 * @returns
	 */
	public async GetGoodbye(guildId: string): Promise<GoodbyeSchema | null> {
		if (!this.cachingDisabled) return this.cache.get(guildId) ?? null;

		return await this.query.findOne({ guild_id: guildId });
	}
}
