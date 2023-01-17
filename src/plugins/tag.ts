import { Collection } from 'oceanic.js';
import config from '../config/config.js';
import { Tag, TagLimits } from '../database/schemas/tag.js';
import type Main from '../main.js';

export class TagCommandPlugin {
	private instance: Main;
	// Cache of all tags mapped by guildId
	public cache: Collection<string, Tag[]>;

	public query;

	private cachingDisabled: boolean;

	public constructor(i: Main) {
		this.instance = i;
		this.cache = new Collection();
		this.query = this.instance.database.managers.tag;
		this.cachingDisabled = config.cacheDisabled.tags;

		this.init();
	}

	public async init(): Promise<void> {
		if (this.cachingDisabled) return;

		// Load all tags into cache
		const tags = await this.query.find();

		for (const tag of tags) {
			const cachedTags = this.cache.get(tag.guild_id);

			if (cachedTags) {
				cachedTags.push(tag);
				this.cache.set(tag.guild_id, cachedTags);
			} else {
				this.cache.set(tag.guild_id, [tag]);
			}
		}
	}

	/**
	 * Creates a tag record in the database
	 * @param guildId
	 * @param name
	 * @param content
	 * @param createdBy
	 * @param createdById
	 */
	public async CreateTag(guildId: string, name: string, content: string, createdBy: string, createdById: string): Promise<Tag> {
		const data = {
			guild_id: guildId,
			name: name,
			content: content,
			created_by_name: createdBy,
			created_by_id: createdById,
			created_at: new Date(),
			updated_at: null
		} as Tag;

		if (!this.cachingDisabled) {
			// Add the tag to the cache
			const cachedTags = this.cache.get(guildId);

			if (cachedTags) {
				cachedTags.push(data);
				this.cache.set(guildId, cachedTags);
			} else {
				this.cache.set(guildId, [data]);
			}
		}

		await this.query.create(data);

		return data;
	}

	/**
	 * Updates a tag record in the database
	 * @param guildId
	 * @param name
	 * @param content
	 */
	public async UpdateTag(guildId: string, name: string, content: string): Promise<Tag> {
		const tag = await this.query.findOneAndUpdate(
			{
				guild_id: guildId,
				name: name
			},
			{
				content: content,
				updated_at: new Date()
			},
			{
				// New will return the updated document so we can cache it
				new: true,
				upsert: true
			}
		);

		// Update the tag in the cache

		if (!this.cachingDisabled) {
			const cachedTags = this.cache.get(guildId);

			if (cachedTags) {
				const index = cachedTags.findIndex((t) => t.name === name);
				if (index !== -1) {
					cachedTags[index] = tag;
				} else {
					cachedTags.push(tag);
				}

				this.cache.set(guildId, cachedTags);
			} else {
				this.cache.set(guildId, [tag]);
			}
		}

		return tag;
	}

	public async ClearTags(guildId: string): Promise<void> {
		await this.query.deleteMany({ guild_id: guildId });

		if (!this.cachingDisabled) this.cache.delete(guildId);
	}

	/**
	 * Deletes a tag record in the database
	 * @param guildId
	 * @param name
	 */
	public async DeleteTag(guildId: string, name: string): Promise<void> {
		await this.query.findOneAndDelete({
			guild_id: guildId,
			name: name
		});

		if (!this.cachingDisabled) {
			// Remove the tag from the cache
			const cachedTags = this.cache.get(guildId);

			if (cachedTags) {
				const index = cachedTags.findIndex((t) => t.name === name);
				if (index !== -1) {
					cachedTags.splice(index, 1);
				}

				this.cache.set(guildId, cachedTags);
			} else {
				this.cache.set(guildId, []);
			}
		}
	}

	public async GetTags(guildId: string): Promise<Tag[]> {
		if (!this.cachingDisabled) return this.cache.get(guildId) || [];

		let tags = await this.query.find({ guild_id: guildId });

		if (tags.length === 0) {
			return [];
		}

		return tags;
	}

	public async GetTag(guildId: string, name: string): Promise<Tag | null> {
		if (!this.cachingDisabled) return this.cache.get(guildId)?.find((t) => t.name === name) || null;
		let t_name = name;

		let tag = await this.query.findOne({ guild_id: guildId, name: t_name });

		return tag;
	}

	public async GetTagLimits(guildId: string) {
		let tags;

		if (!this.cachingDisabled) tags = this.cache.get(guildId);
		else tags = await this.query.find({ guild_id: guildId });

		if (!tags) return { limited: false, remaining: TagLimits.MAX_CREATED_TAGS };

		return {
			limited: tags.length >= TagLimits.MAX_CREATED_TAGS,
			remaining: TagLimits.MAX_CREATED_TAGS - tags.length
		};
	}
}
