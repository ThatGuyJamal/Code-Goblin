import { Collection } from 'oceanic.js';
import { CooldownModel } from '../database/schemas/cooldown.js';
export var CooldownDurations;
(function (CooldownDurations) {
    CooldownDurations[CooldownDurations["SECOND"] = 1] = "SECOND";
    CooldownDurations[CooldownDurations["MINUTE"] = 60] = "MINUTE";
    CooldownDurations[CooldownDurations["HOUR"] = 3600] = "HOUR";
    CooldownDurations[CooldownDurations["DAY"] = 86400] = "DAY";
})(CooldownDurations || (CooldownDurations = {}));
export class CooldownCommandPlugin {
    // guild_id-user_id-action_name, expires date
    cache;
    constructor() {
        this.cache = new Collection();
        this.init();
    }
    async init() {
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
    async set(guild_id, user_id, command_name, data) {
        const expires = this.convertTimeToDate(data);
        this.cache.set(`${guild_id}-${user_id}-${command_name}`, expires);
        await CooldownModel.findOneAndUpdate({
            _id: `${guild_id}-${user_id}-${command_name}`
        }, {
            expires
        }, {
            upsert: true,
            new: true
        });
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
    get(guild_id, user_id, command_name) {
        return this.cache.get(`${guild_id}-${user_id}-${command_name}`);
    }
    /**
     * Deletes a cooldown for a user
     * @param guild_id
     * @param user_id
     * @param command_name
     */
    async delete(guild_id, user_id, command_name) {
        this.cache.delete(`${guild_id}-${user_id}-${command_name}`);
        await CooldownModel.findOneAndDelete({
            _id: `${guild_id}-${user_id}-${command_name}`
        });
    }
    /** Clears all cooldowns in the collection */
    async clearCooldownCollection() {
        this.cache.clear();
        await CooldownModel.deleteMany({});
    }
    /**
     * Clears all cooldowns for a guild
     * @param guild_id
     */
    async clearGuild(guild_id) {
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
    async clearCommand(command_name) {
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
    async clearUserCommand(guild_id, user_id, command_name) {
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
    async clearUserGuild(guild_id, user_id) {
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
    isOnCooldown(guild_id, user_id, command_name) {
        const cooldown = this.get(guild_id, user_id, command_name);
        if (!cooldown)
            return false;
        return cooldown.getTime() > Date.now();
    }
    /**
     * Gets the remaining cooldown for a user
     * @param guild_id
     * @param user_id
     * @param command_name
     * @returns
     */
    async getRemainingCooldown(guild_id, user_id, command_name) {
        const cooldown = await this.get(guild_id, user_id, command_name);
        if (!cooldown)
            return 0;
        return cooldown.getTime() - Date.now();
    }
    // Convert CooldownDurations to Date
    convertTimeToDate({ duration, multiplier }) {
        return new Date(Date.now() + duration * multiplier);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29vbGRvd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGx1Z2lucy9jb29sZG93bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXhDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUVoRSxNQUFNLENBQU4sSUFBWSxpQkFLWDtBQUxELFdBQVksaUJBQWlCO0lBQzVCLDZEQUFVLENBQUE7SUFDViw4REFBVyxDQUFBO0lBQ1gsNERBQVcsQ0FBQTtJQUNYLDJEQUFXLENBQUE7QUFDWixDQUFDLEVBTFcsaUJBQWlCLEtBQWpCLGlCQUFpQixRQUs1QjtBQUVELE1BQU0sT0FBTyxxQkFBcUI7SUFDakMsNkNBQTZDO0lBQ3RDLEtBQUssQ0FBMkI7SUFFdkM7UUFDQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFFOUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQUVPLEtBQUssQ0FBQyxJQUFJO1FBQ2pCLE1BQU0sYUFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWxFLE1BQU0sU0FBUyxHQUFHLE1BQU0sYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTdDLEtBQUssTUFBTSxNQUFNLElBQUksU0FBUyxFQUFFO1lBQy9CLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3QjtJQUNGLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQWdCLEVBQUUsT0FBZSxFQUFFLFlBQW9CLEVBQUUsSUFB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