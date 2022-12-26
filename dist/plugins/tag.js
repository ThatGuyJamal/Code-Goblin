import { Collection } from 'oceanic.js';
import { TagLimits } from '../database/schemas/tags.js';
export class TagCommandPlugin {
    instance;
    // Cache of all tags mapped by guildId
    cache;
    query;
    constructor(i) {
        this.instance = i;
        this.cache = new Collection();
        this.query = this.instance.database.managers.tag;
        this.init();
    }
    async init() {
        // Load all tags into cache
        const tags = await this.query.find();
        for (const tag of tags) {
            const cachedTags = this.cache.get(tag.guild_id);
            if (cachedTags) {
                cachedTags.push(tag);
                this.cache.set(tag.guild_id, cachedTags);
            }
            else {
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
    async CreateTag(guildId, name, content, createdBy, createdById) {
        const data = {
            guild_id: guildId,
            name: name,
            content: content,
            created_by_name: createdBy,
            created_by_id: createdById,
            created_at: new Date(),
            updated_at: null
        };
        // Add the tag to the cache
        const cachedTags = this.cache.get(guildId);
        if (cachedTags) {
            cachedTags.push(data);
            this.cache.set(guildId, cachedTags);
        }
        else {
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
    async UpdateTag(guildId, name, content) {
        const tag = await this.query.findOneAndUpdate({
            guild_id: guildId,
            name: name
        }, {
            content: content,
            updated_at: new Date()
        }, {
            // New will return the updated document so we can cache it
            new: true,
            upsert: true
        });
        // Update the tag in the cache
        const cachedTags = this.cache.get(guildId);
        if (cachedTags) {
            const index = cachedTags.findIndex((t) => t.name === name);
            if (index !== -1) {
                cachedTags[index] = tag;
            }
            else {
                cachedTags.push(tag);
            }
            this.cache.set(guildId, cachedTags);
        }
        else {
            this.cache.set(guildId, [tag]);
        }
        return tag;
    }
    /**
     * Deletes a tag record in the database
     * @param guildId
     * @param name
     */
    async DeleteTag(guildId, name) {
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
        }
        else {
            this.cache.set(guildId, []);
        }
    }
    GetTags(guildId) {
        return this.cache.get(guildId) || [];
    }
    GetTag(guildId, name) {
        return this.cache.get(guildId)?.find((t) => t.name === name);
    }
    GetTagLimit(guildId) {
        const tags = this.cache.get(guildId);
        if (!tags)
            return { limited: false, remaining: TagLimits.MAX_CREATED_TAGS };
        return {
            limited: tags.length >= TagLimits.MAX_CREATED_TAGS,
            remaining: TagLimits.MAX_CREATED_TAGS - tags.length
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsdWdpbnMvdGFnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDeEMsT0FBTyxFQUFPLFNBQVMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRzdELE1BQU0sT0FBTyxnQkFBZ0I7SUFDcEIsUUFBUSxDQUFPO0lBQ3ZCLHNDQUFzQztJQUMvQixLQUFLLENBQTRCO0lBRWhDLEtBQUssQ0FBQztJQUVkLFlBQW1CLENBQU87UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztRQUVqRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDYixDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUk7UUFDaEIsMkJBQTJCO1FBQzNCLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVyQyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUN2QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFaEQsSUFBSSxVQUFVLEVBQUU7Z0JBQ2YsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUN6QztpQkFBTTtnQkFDTixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNwQztTQUNEO0lBQ0YsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQWUsRUFBRSxJQUFZLEVBQUUsT0FBZSxFQUFFLFNBQWlCLEVBQUUsV0FBbUI7UUFDNUcsTUFBTSxJQUFJLEdBQUc7WUFDWixRQUFRLEVBQUUsT0FBTztZQUNqQixJQUFJLEVBQUUsSUFBSTtZQUNWLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLGVBQWUsRUFBRSxTQUFTO1lBQzFCLGFBQWEsRUFBRSxXQUFXO1lBQzFCLFVBQVUsRUFBRSxJQUFJLElBQUksRUFBRTtZQUN0QixVQUFVLEVBQUUsSUFBSTtTQUNULENBQUM7UUFFVCwyQkFBMkI7UUFDM0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFM0MsSUFBSSxVQUFVLEVBQUU7WUFDZixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztTQUNwQzthQUFNO1lBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNoQztRQUVELE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQWUsRUFBRSxJQUFZLEVBQUUsT0FBZTtRQUNwRSxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQzVDO1lBQ0MsUUFBUSxFQUFFLE9BQU87WUFDakIsSUFBSSxFQUFFLElBQUk7U0FDVixFQUNEO1lBQ0MsT0FBTyxFQUFFLE9BQU87WUFDaEIsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFO1NBQ3RCLEVBQ0Q7WUFDQywwREFBMEQ7WUFDMUQsR0FBRyxFQUFFLElBQUk7WUFDVCxNQUFNLEVBQUUsSUFBSTtTQUNaLENBQ0QsQ0FBQztRQUVGLDhCQUE4QjtRQUU5QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUzQyxJQUFJLFVBQVUsRUFBRTtZQUNmLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDM0QsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ2pCLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7YUFDeEI7aUJBQU07Z0JBQ04sVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQjtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztTQUNwQzthQUFNO1lBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUMvQjtRQUVELE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQWUsRUFBRSxJQUFZO1FBQ25ELE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztZQUNqQyxRQUFRLEVBQUUsT0FBTztZQUNqQixJQUFJLEVBQUUsSUFBSTtTQUNWLENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUNoQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUzQyxJQUFJLFVBQVUsRUFBRTtZQUNmLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDM0QsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ2pCLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzVCO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ3BDO2FBQU07WUFDTixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDNUI7SUFDRixDQUFDO0lBRU0sT0FBTyxDQUFDLE9BQWU7UUFDN0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxPQUFlLEVBQUUsSUFBWTtRQUMxQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRU0sV0FBVyxDQUFDLE9BQWU7UUFDakMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFNUUsT0FBTztZQUNOLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxnQkFBZ0I7WUFDbEQsU0FBUyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTTtTQUNuRCxDQUFDO0lBQ0gsQ0FBQztDQUNEIn0=