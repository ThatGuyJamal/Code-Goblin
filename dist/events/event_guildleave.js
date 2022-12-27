import { GlobalStatsModel } from '../database/schemas/statistics.js';
import { MainInstance } from '../main.js';
export default async function GuildCreateEvent(guild) {
    await GlobalStatsModel.findOneAndUpdate({ find_id: 'global' }, { $inc: { guilds_left: 1 } }, {
        upsert: true,
        new: true
    });
    await MainInstance.utils.sendToLogChannel('api', {
        content: `Left a guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members. Now in ${MainInstance.DiscordClient.guilds.size} guilds.`
    });
    // Clear cache on guild leave to save memory
    const TagPluginCache = MainInstance.collections.commands.plugins.tags.cache;
    const welcomePluginCache = MainInstance.collections.commands.plugins.welcome.cache;
    const GoodbyePluginCache = MainInstance.collections.commands.plugins.goodbye.cache;
    if (TagPluginCache.has(guild.id)) {
        TagPluginCache.delete(guild.id);
    }
    if (welcomePluginCache.has(guild.id)) {
        welcomePluginCache.delete(guild.id);
    }
    if (GoodbyePluginCache.has(guild.id)) {
        GoodbyePluginCache.delete(guild.id);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfZ3VpbGRsZWF2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvZXZlbnRfZ3VpbGRsZWF2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRTFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxVQUFVLGdCQUFnQixDQUFDLEtBQVk7SUFDMUQsTUFBTSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FDdEMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQ3JCLEVBQUUsSUFBSSxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQzVCO1FBQ0MsTUFBTSxFQUFFLElBQUk7UUFDWixHQUFHLEVBQUUsSUFBSTtLQUNULENBQ0QsQ0FBQztJQUVGLE1BQU0sWUFBWSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7UUFDaEQsT0FBTyxFQUFFLGlCQUFpQixLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFLFVBQVUsS0FBSyxDQUFDLFdBQVcsb0JBQW9CLFlBQVksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksVUFBVTtLQUNoSixDQUFDLENBQUM7SUFFSCw0Q0FBNEM7SUFFNUMsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDNUUsTUFBTSxrQkFBa0IsR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNuRixNQUFNLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBRW5GLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDakMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDaEM7SUFFRCxJQUFJLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDckMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNwQztJQUVELElBQUksa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNyQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3BDO0FBQ0YsQ0FBQyJ9