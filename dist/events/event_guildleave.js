import { GlobalStatsModel } from '../database/schemas/statistics.js';
import { MainInstance } from '../main.js';
export default async function GuildCreateEvent(guild) {
    await MainInstance.utils.sendToLogChannel('api', {
        content: `Left a guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members. Now in ${MainInstance.DiscordClient.guilds.size} guilds.`
    });
    await GlobalStatsModel.findOneAndUpdate({ find_id: 'global' }, { $inc: { guilds_left: 1 } }, {
        upsert: true,
        new: true
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfZ3VpbGRsZWF2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvZXZlbnRfZ3VpbGRsZWF2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRTFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxVQUFVLGdCQUFnQixDQUFDLEtBQVk7SUFDMUQsTUFBTSxZQUFZLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRTtRQUNoRCxPQUFPLEVBQUUsaUJBQWlCLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUsVUFBVSxLQUFLLENBQUMsV0FBVyxvQkFBb0IsWUFBWSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxVQUFVO0tBQ2hKLENBQUMsQ0FBQztJQUVILE1BQU0sZ0JBQWdCLENBQUMsZ0JBQWdCLENBQ3RDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUNyQixFQUFFLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUM1QjtRQUNDLE1BQU0sRUFBRSxJQUFJO1FBQ1osR0FBRyxFQUFFLElBQUk7S0FDVCxDQUNELENBQUM7QUFDSCxDQUFDIn0=