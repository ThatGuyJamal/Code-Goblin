import { Collection } from 'oceanic.js';
import type { ContentType, Welcome } from '../database/schemas/welcome.js';
import type Main from '../main.js';

export class WelcomeCommandPlugin {
	private instance: Main;
	// Cache of all tags mapped by guildId
	public cache: Collection<string, Welcome>;

	public query;

	public constructor(i: Main) {
		this.instance = i;
		this.cache = new Collection();
		this.query = this.instance.database.managers.welcome;

		this.init();
	}

	public async init(): Promise<void> {
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
	public async CreateWelcome(guildId: string, channelId: string, contentType: ContentType, content: string, enabled: boolean): Promise<Welcome> {
		const data = {
			guild_id: guildId,
			channel_id: channelId,
			content_type: contentType,
			content: content,
			enabled: enabled
		} as Welcome;

		// Add the tag to the cache
		this.cache.set(guildId, data);

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
	public async UpdateWelcome(guildId: string, channelId: string, contentType: ContentType, content: string, enabled: boolean): Promise<Welcome> {
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

		this.cache.set(guildId, welcome);

		return welcome;
	}

	/**
	 * Deletes a welcome message for a guild
	 * @param guildId
	 */
	public async DeleteWelcome(guildId: string): Promise<void> {
		this.cache.delete(guildId);
		await this.query.deleteOne({ guild_id: guildId });
	}

	/**
	 * Gets the welcome message for a guild
	 * @param guildId
	 * @returns
	 */
	public async GetWelcome(guildId: string): Promise<Welcome | undefined> {
		return this.cache.get(guildId);
	}
}
