import { ButtonStyles, ComponentTypes } from 'oceanic.js';
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
    const botMention = `<@${MainInstance.DiscordClient.user.id}>`;
    if (isOwners) {
        // Read arguments for prefix and the command
        const args = message.content.slice(config.BotPrefix.length).trim().split(/ +/g);
        const command = args.shift()?.toLowerCase();
        // Reply with the list of test commands if the bot is mentioned in a message
        if (message.content.startsWith(botMention)) {
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
    else {
        // Reply with the list of test commands if the bot is mentioned in a message
        if (message.content.startsWith(botMention)) {
            return await message.channel.createMessage({
                content: `Please use my slash command \`/commands\` to see a list of commands!`,
                components: [
                    {
                        type: ComponentTypes.ACTION_ROW,
                        components: [
                            {
                                type: ComponentTypes.BUTTON,
                                style: ButtonStyles.LINK,
                                label: 'Invite Bot',
                                url: config.BotClientOAuth2Url
                            },
                            {
                                type: ComponentTypes.BUTTON,
                                style: ButtonStyles.LINK,
                                label: 'Code Repository',
                                url: config.GithubRepository
                            },
                            {
                                type: ComponentTypes.BUTTON,
                                style: ButtonStyles.LINK,
                                label: 'Website',
                                url: config.whisper_room.url
                            }
                        ]
                    }
                ]
            });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfbWVzc2FnZUNyZWF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvZXZlbnRfbWVzc2FnZUNyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBVyxNQUFNLFlBQVksQ0FBQztBQUNuRSxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXZELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBRXpFLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLE9BQWdCO0lBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSztRQUFFLE9BQU87SUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPO1FBQUUsT0FBTztJQUM3QixJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRztRQUFFLE9BQU87SUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1FBQUUsT0FBTztJQUU1QixNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUV0RSxNQUFNLFVBQVUsR0FBRyxLQUFLLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBRTlELElBQUksUUFBUSxFQUFFO1FBQ2IsNENBQTRDO1FBQzVDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFB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