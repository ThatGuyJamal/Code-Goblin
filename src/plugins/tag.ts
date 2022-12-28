import { Collection } from 'oceanic.js';
import { Tag, TagLimits } from '../database/schemas/tag.js';
import type Main from '../main.js';

export class TagCommandPlugin {
	private instance: Main;
	// Cache of all tags mapped by guildId
	public cache: Collection<string, Tag[]>;

	public query;

	public constructor(i: Main) {
		this.instance = i;
		this.cache = new Collection();
		this.query = this.instance.database.managers.tag;

		this.init();
	}

	public async init(): Promise<void> {
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

		// Add the tag to the cache
		const cachedTags = this.cache.get(guildId);

		if (cachedTags) {
			cachedTags.push(data);
			this.cache.set(guildId, cachedTags);
		} else {
			this.cache.set(guildId, [data]);
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

		return tag;
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

	public GetTags(guildId: string): Tag[] {
		return this.cache.get(guildId) || [];
	}

	public GetTag(guildId: string, name: string): Tag | undefined {
		return this.cache.get(guildId)?.find((t) => t.name === name);
	}

	public GetTagLimit(guildId: string) {
		const tags = this.cache.get(guildId);
		if (!tags) return { limited: false, remaining: TagLimits.MAX_CREATED_TAGS };

		return {
			limited: tags.length >= TagLimits.MAX_CREATED_TAGS,
			remaining: TagLimits.MAX_CREATED_TAGS - tags.length
		};
	}
}
