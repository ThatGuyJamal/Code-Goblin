import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'oceanic.js';
import { CreateCommand } from '../command.js';
import { TagLimits } from '../database/schemas/tags.js';
export default CreateCommand({
    trigger: 'tag',
    description: 'Tags plugin',
    type: ApplicationCommandTypes.CHAT_INPUT,
    register: 'global',
    requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
    requiredUserPermissions: ['SEND_MESSAGES', 'MANAGE_GUILD'],
    options: (opt) => {
        opt
            .addOption('tag', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
            option
                .setName('create')
                .setDescription('Create a tag')
                .addOption('name', ApplicationCommandOptionTypes.STRING, (option) => {
                option.setName('name').setDescription('The name of the tag').setRequired(true);
            })
                .addOption('content', ApplicationCommandOptionTypes.STRING, (option) => {
                option.setName('content').setDescription('The content of the tag').setRequired(true);
            });
        })
            .setDMPermission(false)
            .setDefaultMemberPermissions(['MANAGE_MESSAGES']),
            opt
                .addOption('tag', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
                option
                    .setName('delete')
                    .setDescription('Delete a tag')
                    .addOption('name', ApplicationCommandOptionTypes.STRING, (option) => {
                    option.setName('name').setDescription('The name of the tag').setRequired(true);
                });
            })
                .setDMPermission(false)
                .setDefaultMemberPermissions(['MANAGE_MESSAGES']),
            opt
                .addOption('tag', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
                option
                    .setName('edit')
                    .setDescription('Edit a tag')
                    .addOption('name', ApplicationCommandOptionTypes.STRING, (option) => {
                    option.setName('name').setDescription('The name of the tag').setRequired(true);
                })
                    .addOption('content', ApplicationCommandOptionTypes.STRING, (option) => {
                    option.setName('content').setDescription('The content of the tag').setRequired(true);
                });
            })
                .setDMPermission(false)
                .setDefaultMemberPermissions(['MANAGE_MESSAGES']),
            opt
                .addOption('tag', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
                option.setName('list').setDescription('List all tags in this server');
            })
                .setDMPermission(false),
            opt
                .addOption('tag', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
                option
                    .setName('view')
                    .setDescription('View a tag')
                    .addOption('name', ApplicationCommandOptionTypes.STRING, (option) => {
                    option.setName('name').setDescription('The name of the tag').setRequired(true);
                });
            })
                .setDMPermission(false);
    },
    run: async (instance, interaction) => {
        await interaction.defer();
        const subCommand = interaction.data.options.getSubCommand(true);
        const tagLimits = instance.collections.commands.plugins.tags.GetTagLimit(interaction.guild.id);
        if (subCommand.find((name) => name === 'create')) {
            const name = interaction.data.options.getString('name', true);
            const content = interaction.data.options.getString('content', true);
            // Check if the tax limit has been reached
            if (tagLimits.limited) {
                return await interaction.createFollowup({
                    content: `You have reached the tag limit of \`${TagLimits.MAX_CREATED_TAGS}\`! You can delete a tag to create a new one.`
                });
            }
            // Check if the tag already exists
            const tagExists = instance.collections.commands.plugins.tags.GetTag(interaction.guild.id, name);
            if (tagExists) {
                return await interaction.createFollowup({
                    content: `Tag \`${name}\` already exists!`
                });
            }
            const tag = await instance.collections.commands.plugins.tags.CreateTag(interaction.guild.id, name, content, interaction.user.id, interaction.user.tag);
            return await interaction.createFollowup({
                content: `Tag \`${tag.name}\` created!`
            });
        }
        if (subCommand.find((name) => name === 'delete')) {
            const name = interaction.data.options.getString('name', true);
            // Check if the tag exists
            const tagExists = instance.collections.commands.plugins.tags.GetTag(interaction.guild.id, name);
            if (!tagExists) {
                return await interaction.createFollowup({
                    content: `Tag \`${name}\` doesn't exist!`
                });
            }
            await instance.collections.commands.plugins.tags.DeleteTag(interaction.guild.id, name);
            return await interaction.createFollowup({
                content: `Tag deleted!`
            });
        }
        if (subCommand.find((name) => name === 'edit')) {
            const name = interaction.data.options.getString('name', true);
            const content = interaction.data.options.getString('content', true);
            // Check if the tag exists
            const tagExists = instance.collections.commands.plugins.tags.GetTag(interaction.guild.id, name);
            if (!tagExists) {
                return await interaction.createFollowup({
                    content: `Tag \`${name}\` doesn't exist!`
                });
            }
            const tag = await instance.collections.commands.plugins.tags.UpdateTag(interaction.guild.id, name, content);
            return await interaction.createFollowup({
                content: `Tag \`${tag.name}\` edited!`
            });
        }
        if (subCommand.find((name) => name === 'list')) {
            const tags = instance.collections.commands.plugins.tags.GetTags(interaction.guild.id);
            const noTags = tags.length === 0;
            return await interaction.createFollowup({
                content: `Available tags: ${noTags
                    ? 'No Tags created for this server.\n\nMembers with the __Manage Server__ permission can create, update, and delete tags.'
                    : tags.map((tag) => `\`${tag.name}\``).join(', ')}`
            });
        }
        if (subCommand.find((name) => name === 'view')) {
            const name = interaction.data.options.getString('name', true);
            const tag = instance.collections.commands.plugins.tags.GetTag(interaction.guild.id, name);
            return await interaction.createFollowup({
                content: tag ? tag.content : 'Tag not found!'
            });
        }
        return await interaction.createFollowup({
            content: 'Invalid subcommand!'
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3RhZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDcEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFeEQsZUFBZSxhQUFhLENBQUM7SUFDNUIsT0FBTyxFQUFFLEtBQUs7SUFDZCxXQUFXLEVBQUUsYUFBYTtJQUMxQixJQUFJLEVBQUUsdUJBQXVCLENBQUMsVUFBVTtJQUN4QyxRQUFRLEVBQUUsUUFBUTtJQUNsQixzQkFBc0IsRUFBRSxDQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUscUJBQXFCLENBQUM7SUFDL0UsdUJBQXVCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDO0lBQzFELE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ2hCLEdBQUc7YUFDRCxTQUFTLENBQUMsS0FBSyxFQUFFLDZCQUE2QixDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3ZFLE1BQU07aUJBQ0osT0FBTyxDQUFDLFFBQVEsQ0FBQztpQkFDakIsY0FBYyxDQUFDLGNBQWMsQ0FBQztpQkFDOUIsU0FBUyxDQUFDLE1BQU0sRUFBRSw2QkFBNkIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDbkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEYsQ0FBQyxDQUFDO2lCQUNELFNBQVMsQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ3RFLE1BQU0sQ0FB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