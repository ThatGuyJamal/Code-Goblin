import { MainInstance } from '../main.js';
export default async function (member, guild) {
    const result = await getGoodbyeResults(member);
    if (!result)
        return;
    await result.GoodbyeChannel.createMessage({
        content: result.GoodbyeMessage
    }).catch(() => { });
}
export async function getGoodbyeResults(member) {
    const { guild } = member;
    const data = await MainInstance.collections.commands.plugins.goodbye.GetGoodbye(guild.id);
    if (!data)
        return;
    const GoodbyeChannel = MainInstance.DiscordClient.getChannel(data.channel_id);
    if (!GoodbyeChannel)
        return;
    const GoodbyeMessage = data.content
        .replace(/{user}/g, member.mention)
        .replace(/{server}/g, guild.name)
        .replace(/{memberCount}/g, guild.memberCount.toString());
    return { GoodbyeChannel, GoodbyeMessage };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfZ29vZGJ5ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvZXZlbnRfZ29vZGJ5ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRTFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLE1BQWMsRUFBRSxLQUF1QjtJQUNyRSxNQUFNLE1BQU0sR0FBRyxNQUFNLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRS9DLElBQUksQ0FBQyxNQUFNO1FBQUUsT0FBTztJQUVwQixNQUFNLE1BQU0sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDO1FBQ3pDLE9BQU8sRUFBRSxNQUFNLENBQUMsY0FBYztLQUM5QixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLGlCQUFpQixDQUFDLE1BQWM7SUFDckQsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUV6QixNQUFNLElBQUksR0FBRyxNQUFNLFlBQVksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUUxRixJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU87SUFFbEIsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBZ0IsQ0FBQztJQUU3RixJQUFJLENBQUMsY0FBYztRQUFFLE9BQU87SUFFNUIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU87U0FDakMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDO1NBQ2xDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQztTQUNoQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBRTFELE9BQU8sRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLENBQUM7QUFDM0MsQ0FBQyJ9