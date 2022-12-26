import { ApplicationCommandTypes, ButtonStyles, ComponentTypes } from 'oceanic.js';
import { CreateCommand } from '../command.js';
import config from '../config/config.js';
export default CreateCommand({
    trigger: 'commands',
    description: 'Lists all commands',
    type: ApplicationCommandTypes.CHAT_INPUT,
    register: 'global',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvY29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbkYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQztBQUV6QyxlQUFlLGFBQWEsQ0FBQztJQUM1QixPQUFPLEVBQUUsVUFBVTtJQUNuQixXQUFXLEVBQUUsb0JBQW9CO0lBQ2pDLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxVQUFVO0lBQ3hDLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxFQUFFO1FBQ3BDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUM5RSxPQUFPO2dCQUNOLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTztnQkFDckIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO2FBQ2hDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxDQUFDLGFBQWEsQ0FBQztZQUMvQixNQUFNLEVBQUU7Z0JBQ1A7b0JBQ0MsS0FBSyxFQUFFLFVBQVU7b0JBQ2pCLFdBQVcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2lCQUN0RTthQUNEO1lBQ0QsVUFBVSxFQUFFO2dCQUNYO29CQUNDLElBQUksRUFBRSxjQUFjLENBQUMsVUFBVTtvQkFDL0IsVUFBVSxFQUFFO3dCQUNYOzRCQUNDLElBQUksRUFBRSxjQUFjLENBQUMsTUFBTTs0QkFDM0IsS0FBSyxFQUFFLFlBQVksQ0FBQyxJQUFJOzRCQUN4QixLQUFLLEVBQUUsV0FBVzs0QkFDbEIsR0FBRyxFQUFFLE1BQU0sQ0FBQywwQkFBMEI7eUJBQ3RDO3dCQUNEOzRCQUNDLElBQUksRUFBRSxjQUFjLENBQUMsTUFBTTs0QkFDM0IsS0FBSyxFQUFFLFlBQVksQ0FBQyxJQUFJOzRCQUN4QixLQUFLLEVBQUUsY0FBYzs0QkFDckIsR0FBRyxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRzt5QkFDNUI7cUJBQ0Q7aUJBQ0Q7YUFDRDtTQUNELENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRCxDQUFDLENBQUMifQ==