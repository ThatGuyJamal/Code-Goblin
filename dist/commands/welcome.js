import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes } from 'oceanic.js';
import { CreateCommand } from '../command.js';
export default CreateCommand({
    trigger: 'welcome',
    description: 'welcome plugin',
    type: ApplicationCommandTypes.CHAT_INPUT,
    register: 'global',
    options: (opt) => {
        opt
            .addOption('welcome', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
            option
                .setName('configure')
                .setDescription('configure welcome settings')
                .addOption('channel', ApplicationCommandOptionTypes.CHANNEL, (option) => {
                option
                    .setName('channel')
                    .setDescription('The name of the channel to send message events')
                    .setRequired(true)
                    .setChannelTypes([ChannelTypes.GUILD_TEXT]);
            })
                // TODO add option for embed or text
                // .addOption('type', ApplicationCommandOptionTypes.STRING, (option) => {
                // 	option
                // 		.setName('type')
                // 		.setDescription('If you want an embed based message or a normal message')
                // 		.addChoice('Embed', 'embed')
                // 		.addChoice('Normal Text', 'text')
                // 		.setRequired(true);
                // })
                .addOption('context', ApplicationCommandOptionTypes.STRING, (option) => {
                option.setName('context').setDescription('The context you want to send during user welcome.').setRequired(true);
            });
        })
            .setDMPermission(false)
            .setDefaultMemberPermissions(['MANAGE_GUILD']),
            opt
                .addOption('welcome', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
                option.setName('delete').setDescription('Delete the welcome plugin');
            })
                .setDMPermission(false)
                .setDefaultMemberPermissions(['MANAGE_GUILD']),
            opt
                .addOption('welcome', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
                option.setName('view').setDescription('View the current welcome message');
            })
                .setDMPermission(false);
    },
    run: async (instance, interaction) => {
        await interaction.defer();
        if (!interaction.guild)
            return;
        const subCommand = interaction.data.options.getSubCommand(true);
        if (subCommand.find((name) => name === 'configure')) {
            const channel = interaction.data.options.getChannel('channel', true);
            const context = interaction.data.options.getString('context', true);
            await instance.collections.commands.plugins.welcome.CreateWelcome(interaction.guild.id, channel.id, 'text', context, true);
            return await interaction.createFollowup({
                content: 'Welcome Plugin Configured!'
            });
        }
        if (subCommand.find((name) => name === 'delete')) {
            await instance.collections.commands.plugins.welcome.DeleteWelcome(interaction.guild.id);
            return await interaction.createFollowup({
                content: 'Welcome Plugin Config Deleted!'
            });
        }
        if (subCommand.find((name) => name === 'view')) {
            const data = await instance.collections.commands.plugins.welcome.GetWelcome(interaction.guild.id);
            if (!data)
                return await interaction.createFollowup({
                    content: 'No data to view.'
                });
            return await interaction.createFollowup({
                embeds: [
                    {
                        title: 'Welcome Plugin Current Config',
                        description: data.content
                    }
                ]
            });
        }
        return await interaction.createFollowup({
            content: 'Invalid subcommand!'
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsY29tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy93ZWxjb21lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSx1QkFBdUIsRUFBRSxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5QyxlQUFlLGFBQWEsQ0FBQztJQUM1QixPQUFPLEVBQUUsU0FBUztJQUNsQixXQUFXLEVBQUUsZ0JBQWdCO0lBQzdCLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxVQUFVO0lBQ3hDLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ2hCLEdBQUc7YUFDRCxTQUFTLENBQUMsU0FBUyxFQUFFLDZCQUE2QixDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQzNFLE1BQU07aUJBQ0osT0FBTyxDQUFDLFdBQVcsQ0FBQztpQkFDcEIsY0FBYyxDQUFDLDRCQUE0QixDQUFDO2lCQUM1QyxTQUFTLENBQUMsU0FBUyxFQUFFLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUN2RSxNQUFNO3FCQUNKLE9BQU8sQ0FBQyxTQUFTLENBQUM7cUJBQ2xCLGNBQWMsQ0FBQyxnREFBZ0QsQ0FBQztxQkFDaEUsV0FBVyxDQUFDLElBQUksQ0FBQztxQkFDakIsZUFBZSxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDOUMsQ0FBQyxDQUFDO2dCQUNGLG9DQUFvQztnQkFDcEMseUVBQXlFO2dCQUN6RSxVQUFVO2dCQUNWLHFCQUFxQjtnQkFDckIsOEVBQThFO2dCQUM5RSxpQ0FBaUM7Z0JBQ2pDLHNDQUFzQztnQkFDdEMsd0JBQXdCO2dCQUN4QixLQUFLO2lCQUNKLFNBQVMsQ0FBQyxTQUFTLEVBQUUsNkJB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