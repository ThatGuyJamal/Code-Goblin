import { GlobalStatsModel } from '../database/schemas/statistics.js';
import { MainInstance } from '../main.js';
export default async function GuildCreateEvent(guild) {
    await MainInstance.utils.sendToLogChannel('api', {
        content: `Joined a new guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members. Now in ${MainInstance.DiscordClient.guilds.size} guilds.`
    });
    await GlobalStatsModel.findOneAndUpdate({ find_id: 'global' }, { $inc: { guilds_joined: 1 } }, {
        upsert: true,
        new: true
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfZ3VpbGRjcmVhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL2V2ZW50X2d1aWxkY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsZ0JBQWdCLENBQUMsS0FBWTtJQUMxRCxNQUFNLFlBQVksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFO1FBQ2hELE9BQU8sRUFBRSx1QkFBdUIsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRSxVQUFVLEtBQUssQ0FBQyxXQUFXLG9CQUFvQixZQUFZLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFVBQVU7S0FDdEosQ0FBQyxDQUFDO0lBRUgsTUFBTSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FDdEMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQ3JCLEVBQUUsSUFBSSxFQUFFLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQzlCO1FBQ0MsTUFBTSxFQUFFLElBQUk7UUFDWixHQUFHLEVBQUUsSUFBSTtLQUNULENBQ0QsQ0FBQztBQUNILENBQUMifQ==