import config from '../config/config.js';
import { MainInstance } from '../main.js';
import { getGoodbyeResults } from './event_goodbye.js';
import { getWelcomeResults } from './event_welcome.js';
const test_command_names = ['test-help', 'test-welcome', 'test-goodbye'];
export default async function (message) {
    if (!message.guild)
        return;
    if (!message.channel)
        return;
    if (message.author.bot)
        return;
    if (!message.member)
        return;
    const isOwners = MainInstance.keys.super_users.has(message.author.id);
    if (isOwners) {
        // Read arguments for prefix and the command
        const args = message.content.slice(config.BotPrefix.length).trim().split(/ +/g);
        const command = args.shift()?.toLowerCase();
        // Reply with the list of test commands if the bot is mentioned in a message
        if (message.content.startsWith(`<@${MainInstance.DiscordClient.user.id}>`)) {
            return await message.channel.createMessage({
                content: `Prefix: ${config.BotPrefix} | Test commands: ${test_command_names.join(',')}`
            });
        }
        if (command === 'test-help') {
            return await message.channel.createMessage({
                content: `Test commands: ${test_command_names.join(', ')}`
            });
        }
        if (command === 'test-welcome') {
            MainInstance.DiscordClient.emit('guildMemberAdd', message.member);
            let data = await getWelcomeResults(message.member);
            await message.channel.createMessage({
                content: 'Test welcome plugin ran!',
                embeds: [
                    {
                        description: `Sending to...<#${data?.welcomeChannel.id}>\n\n${data?.welcomeMessage}`
                    }
                ]
            });
        }
        if (command === 'test-goodbye') {
            MainInstance.DiscordClient.emit('guildMemberRemove', message.member, message.member.guild);
            let data = await getGoodbyeResults(message.member);
            await message.channel.createMessage({
                content: 'Test goodbye plugin ran!',
                embeds: [
                    {
                        description: `Sending to...<#${data?.GoodbyeChannel.id}>\n\n${data?.GoodbyeMessage}`
                    }
                ]
            });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfbWVzc2FnZUNyZWF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvZXZlbnRfbWVzc2FnZUNyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXZELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBRXpFLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLE9BQWdCO0lBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSztRQUFFLE9BQU87SUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPO1FBQUUsT0FBTztJQUM3QixJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRztRQUFFLE9BQU87SUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1FBQUUsT0FBTztJQUU1QixNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUV0RSxJQUFJLFFBQVEsRUFBRTtRQUNiLDRDQUE0QztRQUM1QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUM7UUFFNUMsNEVBQTRFO1FBQzVFLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxZQUFZLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQzNFLE9BQU8sTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztnQkFDMUMsT0FBTyxFQUFFLFdBQVcsTUFBTSxDQUFDLFNBQVMscUJBQXFCLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTthQUN2RixDQUFDLENBQUM7U0FDSDtRQUVELElBQUksT0FBTyxLQUFLLFdBQVcsRUFBRTtZQUM1QixPQUFPLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7Z0JBQzFDLE9BQU8sRUFBRSxrQkFBa0Isa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2FBQzFELENBQUMsQ0FBQztTQUNIO1FBRUQsSUFBSSxPQUFPLEtBQUssY0FBYyxFQUFFO1lBQy9CLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVsRSxJQUFJLElBQUksR0FBRyxNQUFNLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVuRCxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO2dCQUNuQyxPQUFPLEVBQUUsMEJBQTBCO2dCQUNuQyxNQUFNLEVBQUU7b0JBQ1A7d0JBQ0MsV0FBVyxFQUFFLGtCQUFrQixJQUFJLEVBQUUsY0FBYyxDQUFDLEVBQUUsUUFBUSxJQUFJLEVBQUUsY0FBYyxFQUFFO3FCQUNwRjtpQkFDRDthQUNELENBQUMsQ0FBQztTQUNIO1FBRUQsSUFBSSxPQUFPLEtBQUssY0FBYyxFQUFFO1lBQy9CLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUzRixJQUFJLElBQUksR0FBRyxNQUFNLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVuRCxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO2dCQUNuQyxPQUFPLEVBQUUsMEJBQTBCO2dCQUNuQyxNQUFNLEVBQUU7b0JBQ1A7d0JBQ0MsV0FBVyxFQUFFLGtCQUFrQixJQUFJLEVBQUUsY0FBYyxDQUFDLEVBQUUsUUFBUSxJQUFJLEVBQUUsY0FBYyxFQUFFO3FCQUNwRjtpQkFDRDthQUNELENBQUMsQ0FBQztTQUNIO0tBQ0Q7QUFDRixDQUFDIn0=