import { Collection } from 'oceanic.js';
export class GoodbyeCommandPlugin {
    instance;
    // Cache of all tags mapped by guildId
    cache;
    query;
    constructor(i) {
        this.instance = i;
        this.cache = new Collection();
        this.query = this.instance.database.managers.goodbye;
        this.init();
    }
    async init() {
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
    async CreateGoodbye(guildId, channelId, contentType, content, enabled) {
        const data = {
            guild_id: guildId,
            channel_id: channelId,
            content_type: contentType,
            content: content,
            enabled: enabled
        };
        // Add the tag to the cache
        this.cache.set(guildId, data);
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
    async UpdateGoodbye(guildId, channelId, contentType, content, enabled) {
        const Goodbye = await this.query.findOneAndUpdate({
            guild_id: guildId
        }, {
            guild_id: guildId,
            channel_id: channelId,
            content_type: contentType,
            content: content,
            enabled: enabled
        }, {
            new: true,
            upsert: true
        });
        this.cache.set(guildId, Goodbye);
        return Goodbye;
    }
    /**
     * Deletes a Goodbye message for a guild
     * @param guildId
     */
    async DeleteGoodbye(guildId) {
        this.cache.delete(guildId);
        await this.query.deleteOne({ guild_id: guildId });
    }
    /**
     * Gets the Goodbye message for a guild
     * @param guildId
     * @returns
     */
    async GetGoodbye(guildId) {
        return this.cache.get(guildId);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZGJ5ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wbHVnaW5zL2dvb2RieWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUt4QyxNQUFNLE9BQU8sb0JBQW9CO0lBQ3hCLFFBQVEsQ0FBTztJQUN2QixzQ0FBc0M7SUFDL0IsS0FBSyxDQUE4QjtJQUVuQyxLQUFLLENBQUM7SUFFYixZQUFtQixDQUFPO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFFckQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJO1FBQ2hCLDJCQUEyQjtRQUMzQixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFeEMsS0FBSyxNQUFNLElBQUksSUFBSSxPQUFPLEVBQUU7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNwQztJQUNGLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBZSxFQUFFLFNBQWlCLEVBQUUsV0FBd0IsRUFBRSxPQUFlLEVBQUUsT0FBZ0I7UUFDekgsTUFBTSxJQUFJLEdBQUc7WUFDWixRQUFRLEVBQUUsT0FBTztZQUNqQixVQUFVLEVBQUUsU0FBUztZQUNyQixZQUFZLEVBQUUsV0FBVztZQUN6QixPQUFPLEVBQUUsT0FBTztZQUNoQixPQUFPLEVBQUUsT0FBTztTQUNMLENBQUM7UUFFYiwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTlCLE9BQU8sTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQWUsRUFBRSxTQUFpQixFQUFFLFdBQXdCLEVBQUUsT0FBZSxFQUFFLE9BQWdCO1FBQ3pILE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FDaEQ7WUFDQyxRQUFRLEVBQUUsT0FBTztTQUNqQixFQUNEO1lBQ0MsUUFBUSxFQUFFLE9BQU87WUFDakIsVUFBVSxFQUFFLFNBQVM7WUFDckIsWUFBWSxFQUFFLFdBQVc7WUFDekIsT0FBTyxFQUFFLE9BQU87WUFDaEIsT0FBTyxFQUFFLE9BQU87U0FDaEIsRUFDRDtZQUNDLEdBQUcsRUFBRSxJQUFJO1lBQ1QsTUFBTSxFQUFFLElBQUk7U0FDWixDQUNELENBQUM7UUFFRixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFakMsT0FBTyxPQUFPLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBZTtRQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQWU7UUFDdEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0QifQ==