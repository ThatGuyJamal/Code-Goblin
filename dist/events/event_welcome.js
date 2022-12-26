import { MainInstance } from '../main.js';
export default async function (member) {
    const result = await getWelcomeResults(member);
    if (!result)
        return;
    await result.welcomeChannel
        .createMessage({
        content: result.welcomeMessage
    })
        .catch(() => { });
}
export async function getWelcomeResults(member) {
    const { guild } = member;
    const data = await MainInstance.collections.commands.plugins.welcome.GetWelcome(guild.id);
    if (!data)
        return;
    const welcomeChannel = MainInstance.DiscordClient.getChannel(data.channel_id);
    if (!welcomeChannel)
        return;
    const welcomeMessage = data.content
        .replace(/{user}/g, member.mention)
        .replace(/{server}/g, guild.name)
        .replace(/{memberCount}/g, guild.memberCount.toString());
    return { welcomeChannel, welcomeMessage };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfd2VsY29tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvZXZlbnRfd2VsY29tZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRTFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLE1BQWM7SUFDNUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUUvQyxJQUFJLENBQUMsTUFBTTtRQUFFLE9BQU87SUFFcEIsTUFBTSxNQUFNLENBQUMsY0FBYztTQUN6QixhQUFhLENBQUM7UUFDZCxPQUFPLEVBQUUsTUFBTSxDQUFDLGNBQWM7S0FDOUIsQ0FBQztTQUNELEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRUQsTUFBTSxDQUFDLEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxNQUFjO0lBQ3JELE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFFekIsTUFBTSxJQUFJLEdBQUcsTUFBTSxZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFMUYsSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPO0lBRWxCLE1BQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQWdCLENBQUM7SUFFN0YsSUFBSSxDQUFDLGNBQWM7UUFBRSxPQUFPO0lBRTVCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPO1NBQ2pDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUNsQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUM7U0FDaEMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUUxRCxPQUFPLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxDQUFDO0FBQzNDLENBQUMifQ==