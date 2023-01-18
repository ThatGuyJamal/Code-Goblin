import { Collection } from 'oceanic.js';
import config from '../../config/config.js';
import type { Goodbye } from './schema/goodbye.js';
import type { ContentType } from '../welcome/schema/welcome.js';
import type Main from '../../main.js';

export class GoodbyeCommandPlugin {
	private instance: Main;
	// Cache of all tags mapped by guildId
	public cache: Collection<string, Goodbye>;
	private cachingDisabled: boolean;

	public query;

	public constructor(i: Main) {
		this.instance = i;
		this.cache = new Collection();
		this.query = this.instance.database.managers.goodbye;
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
	public async CreateGoodbye(guildId: string, channelId: string, contentType: ContentType, content: string, enabled: boolean): Promise<Goodbye> {
		const data = {
			guild_id: guildId,
			channel_id: channelId,
			content_type: contentType,
			content: content,
			enabled: enabled
		} as Goodbye;

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
	public async UpdateGoodbye(guildId: string, channelId: string, contentType: ContentType, content: string, enabled: boolean): Promise<Goodbye> {
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
	public async DeleteGoodbye(guildId: string): Promise<void> {
		if (!this.cachingDisabled) this.cache.delete(guildId);
		await this.query.deleteOne({ guild_id: guildId });
	}

	/**
	 * Gets the Goodbye message for a guild
	 * @param guildId
	 * @returns
	 */
	public async GetGoodbye(guildId: string): Promise<Goodbye | null> {
		if (!this.cachingDisabled) return this.cache.get(guildId) ?? null;

		return await this.query.findOne({ guild_id: guildId });
	}
}
