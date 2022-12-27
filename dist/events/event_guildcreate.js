import { GlobalStatsModel } from '../database/schemas/statistics.js';
import { MainInstance } from '../main.js';
export default async function GuildCreateEvent(guild) {
    await GlobalStatsModel.findOneAndUpdate({ find_id: 'global' }, { $inc: { guilds_joined: 1 } }, {
        upsert: true,
        new: true
    });
    await MainInstance.utils.sendToLogChannel('api', {
        content: `Joined a new guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members. Now in ${MainInstance.DiscordClient.guilds.size} guilds.`
    });
    // Load documents into cache on join if any exist
    const welcomePlugin = MainInstance.collections.commands.plugins.welcome;
    const GoodbyePlugin = MainInstance.collections.commands.plugins.goodbye;
    const hasWelcome = await welcomePlugin.query.findOne({ guild_id: guild.id });
    const hasGoodbye = await GoodbyePlugin.query.findOne({ guild_id: guild.id });
    if (hasWelcome) {
        welcomePlugin.cache.set(guild.id, hasWelcome);
    }
    if (hasGoodbye) {
        GoodbyePlugin.cache.set(guild.id, hasGoodbye);
    }
    // Get the tags, because each tag has a record we have to find each tag with this guild id, which will return an array of tags
    const tags = await MainInstance.collections.commands.plugins.tags.query.find({ guild_id: guild.id });
    if (tags.length > 0) {
        MainInstance.collections.commands.plugins.tags.cache.set(guild.id, tags);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfZ3VpbGRjcmVhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL2V2ZW50X2d1aWxkY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsZ0JBQWdCLENBQUMsS0FBWTtJQUMxRCxNQUFNLGdCQUFnQixDQUFDLGdCQUFnQixDQUN0QyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFDckIsRUFBRSxJQUFJLEVBQUUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFDOUI7UUFDQyxNQUFNLEVBQUUsSUFBSTtRQUNaLEdBQUcsRUFBRSxJQUFJO0tBQ1QsQ0FDRCxDQUFDO0lBRUYsTUFBTSxZQUFZLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRTtRQUNoRCxPQUFPLEVBQUUsdUJBQXVCLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUsVUFBVSxLQUFLLENBQUMsV0FBVyxvQkFBb0IsWUFBWSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxVQUFVO0tBQ3RKLENBQUMsQ0FBQztJQUVILGlEQUFpRDtJQUVqRCxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQ3hFLE1BQU0sYUFBYSxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFFeEUsTUFBTSxVQUFVLEdBQUcsTUFBTSxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3RSxNQUFNLFVBQVUsR0FBRyxNQUFNLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRTdFLElBQUksVUFBVSxFQUFFO1FBQ2YsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUM5QztJQUVELElBQUksVUFBVSxFQUFFO1FBQ2YsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUM5QztJQUVELDhIQUE4SDtJQUM5SCxNQUFNLElBQUksR0FBRyxNQUFNLFlBQVksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVyRyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3BCLFlBQVksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3pFO0FBQ0YsQ0FBQyJ9