import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes } from 'oceanic.js';
import { CreateCommand } from '../command.js';
import constants from '../constants.js';
export default CreateCommand({
    trigger: 'goodbye',
    description: 'Goodbye plugin',
    type: ApplicationCommandTypes.CHAT_INPUT,
    register: 'global',
    requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
    requiredUserPermissions: ['SEND_MESSAGES', 'MANAGE_GUILD'],
    options: (opt) => {
        opt
            .addOption('goodbye', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
            option
                .setName('configure')
                .setDescription('configure goodbye settings')
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
                option.setName('context').setDescription('The context you want to send during user goodbye.').setRequired(true);
            });
        })
            .setDMPermission(false)
            .setDefaultMemberPermissions(['MANAGE_GUILD']),
            opt
                .addOption('goodbye', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
                option.setName('delete').setDescription('Delete the goodbye plugin');
            })
                .setDMPermission(false)
                .setDefaultMemberPermissions(['MANAGE_GUILD']),
            opt
                .addOption('goodbye', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
                option.setName('view').setDescription('View the current goodbye message');
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
            await instance.collections.commands.plugins.goodbye.CreateGoodbye(interaction.guild.id, channel.id, 'text', context, true);
            return await interaction.createFollowup({
                content: 'Goodbye Plugin Configured!'
            });
        }
        if (subCommand.find((name) => name === 'delete')) {
            await instance.collections.commands.plugins.goodbye.DeleteGoodbye(interaction.guild.id);
            return await interaction.createFollowup({
                content: 'Goodbye Plugin Config Deleted!'
            });
        }
        if (subCommand.find((name) => name === 'view')) {
            const data = await instance.collections.commands.plugins.goodbye.GetGoodbye(interaction.guild.id);
            if (!data)
                return await interaction.createFollowup({
                    content: 'No data to view.'
                });
            return await interaction.createFollowup({
                embeds: [
                    {
                        title: 'Goodbye Plugin Current Config',
                        description: data.content,
                        fields: [
                            {
                                name: 'raw view',
                                value: `\`\`\`${data.content}\`\`\``,
                                inline: false
                            }
                        ],
                        color: constants.numbers.colors.secondary
                    }
                ]
            });
        }
        return await interaction.createFollowup({
            content: 'Invalid subcommand!'
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZGJ5ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9nb29kYnllLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSx1QkFBdUIsRUFBRSxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLFNBQVMsTUFBTSxpQkFBaUIsQ0FBQztBQUV4QyxlQUFlLGFBQWEsQ0FBQztJQUM1QixPQUFPLEVBQUUsU0FBUztJQUNsQixXQUFXLEVBQUUsZ0JBQWdCO0lBQzdCLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxVQUFVO0lBQ3hDLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLHNCQUFzQixFQUFFLENBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQztJQUMvRSx1QkFBdUIsRUFBRSxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUM7SUFDMUQsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDaEIsR0FBRzthQUNELFNBQVMsQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDM0UsTUFBTTtpQkFDSixPQUFPLENBQUMsV0FBVyxDQUFDO2lCQUNwQixjQUFjLENBQUMsNEJBQTRCLENBQUM7aUJBQzVDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ3ZFLE1BQU07cUJBQ0osT0FBTyxDQUFDLFNBQVMsQ0FBQztxQkFDbEIsY0FBYyxDQUFDLGdEQUFnRCxDQUFDO3FCQUNoRSxXQUFXLENBQUMsSUFBSSxDQUFDO3FCQUNqQixlQUFlLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM5QyxDQUFDLENBQUM7Z0JBQ0Ysb0NBQW9DO2dCQUNw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