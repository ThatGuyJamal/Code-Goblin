import { ApplicationCommandTypes, ButtonStyles, ComponentTypes } from 'oceanic.js';
import { CreateCommand } from '../command.js';
import config from '../config/config.js';
export default CreateCommand({
    trigger: 'commands',
    description: 'Lists all commands',
    type: ApplicationCommandTypes.CHAT_INPUT,
    register: 'global',
    requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
    requiredUserPermissions: ['SEND_MESSAGES'],
    run: async (instance, interaction) => {
        const commands = instance.collections.commands.commandStoreMap.map((command) => {
            return {
                name: command.trigger,
                description: command.description
            };
        });
        await interaction.createMessage({
            embeds: [
                {
                    title: 'Commands',
                    description: `${commands.map((cmd) => `\`/${cmd.name}\``).join(', ')}`
                }
            ],
            components: [
                {
                    type: ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: ComponentTypes.BUTTON,
                            style: ButtonStyles.LINK,
                            label: 'Invite Me',
                            url: config.DevelopmentServerInviteUrl
                        },
                        {
                            type: ComponentTypes.BUTTON,
                            style: ButtonStyles.LINK,
                            label: 'Whisper Room',
                            url: config.whisper_room.url
                        }
                    ]
                }
            ]
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvY29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbkYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQztBQUV6QyxlQUFlLGFBQWEsQ0FBQztJQUM1QixPQUFPLEVBQUUsVUFBVTtJQUNuQixXQUFXLEVBQUUsb0JBQW9CO0lBQ2pDLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxVQUFVO0lBQ3hDLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLHNCQUFzQixFQUFFLENBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQztJQUMvRSx1QkFBdUIsRUFBRSxDQUFDLGVBQWUsQ0FBQztJQUMxQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsRUFBRTtRQUNwQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDOUUsT0FBTztnQkFDTixJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU87Z0JBQ3JCLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVzthQUNoQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLFdBQVcsQ0FBQyxhQUFhLENBQUM7WUFDL0IsTUFBTSxFQUFFO2dCQUNQO29CQUNDLEtBQUssRUFBRSxVQUFVO29CQUNqQixXQUFXLEVBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtpQkFDdEU7YUFDRDtZQUNELFVBQVUsRUFBRTtnQkFDWDtvQkFDQyxJQUFJLEVBQUUsY0FBYyxDQUFDLFVBQVU7b0JBQy9CLFVBQVUsRUFBRTt3QkFDWDs0QkFDQyxJQUFJLEVBQUUsY0FBYyxDQUFDLE1BQU07NEJBQzNCLEtBQUssRUFBRSxZQUFZLENBQUMsSUFBSTs0QkFDeEIsS0FBSyxFQUFFLFdBQVc7NEJBQ2xCLEdBQUcsRUFBRSxNQUFNLENBQUMsMEJBQTBCO3lCQUN0Qzt3QkFDRDs0QkFDQyxJQUFJLEVBQUUsY0FBYyxDQUFDLE1BQU07NEJBQzNCLEtBQUssRUFBRSxZQUFZLENBQUMsSUFBSTs0QkFDeEIsS0FBSyxFQUFFLGNBQWM7NEJBQ3JCLEdBQUcsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUc7eUJBQzVCO3FCQUNEO2lCQUNEO2FBQ0Q7U0FDRCxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0QsQ0FBQyxDQUFDIn0=