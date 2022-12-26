import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'oceanic.js';
import { CreateCommand } from '../command.js';
import { TagLimits } from '../database/schemas/tags.js';
export default CreateCommand({
    trigger: 'tag',
    description: 'Tags plugin',
    type: ApplicationCommandTypes.CHAT_INPUT,
    register: 'global',
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
            .setDefaultMemberPermissions(['MANAGE_GUILD']),
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
                .setDefaultMemberPermissions(['MANAGE_GUILD']),
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
                .setDefaultMemberPermissions(['MANAGE_GUILD']),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3RhZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDcEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFeEQsZUFBZSxhQUFhLENBQUM7SUFDNUIsT0FBTyxFQUFFLEtBQUs7SUFDZCxXQUFXLEVBQUUsYUFBYTtJQUMxQixJQUFJLEVBQUUsdUJBQXVCLENBQUMsVUFBVTtJQUN4QyxRQUFRLEVBQUUsUUFBUTtJQUNsQixPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNoQixHQUFHO2FBQ0QsU0FBUyxDQUFDLEtBQUssRUFBRSw2QkFBNkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN2RSxNQUFNO2lCQUNKLE9BQU8sQ0FBQyxRQUFRLENBQUM7aUJBQ2pCLGNBQWMsQ0FBQyxjQUFjLENBQUM7aUJBQzlCLFNBQVMsQ0FBQyxNQUFNLEVBQUUsNkJBQTZCLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ25FLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hGLENBQUMsQ0FBQztpQkFDRCxTQUFTLENBQUMsU0FBUyxFQUFFLDZCQUE2QixDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUN0RSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RixDQUFDLENBQUMsQ0FB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