import { ApplicationCommandOptionTypes, ApplicationCommandTypes, MessageFlags } from 'oceanic.js';

import { isCanary } from '../../../config/config.js';
import { CreateCommand } from '../../structures/command.js';

import handleCreate from './sub/create.js';
import handleDelete from './sub/delete.js';
import handleClear from './sub/clear.js';
import handleView from './sub/view.js';
import handleList from './sub/list.js';
import handleEdit from './sub/edit.js';

export default CreateCommand({
	trigger: 'tag',
	description: 'Tags plugin',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: isCanary ? 'guild' : 'global',
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	options: (opt) => {
		opt.addOption('tag-1', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option
				.setName('create')
				.setDescription('Create a tag')
				.addOption('name', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('name').setDescription('The name of the tag').setRequired(true);
				})
				.addOption('content', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('content').setDescription('The content of the tag').setRequired(true);
				});
		}).setDMPermission(false);
		opt.addOption('tag-2', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option
				.setName('delete')
				.setDescription('Delete a tag')
				.addOption('name', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('name').setDescription('The name of the tag').setRequired(true);
				});
		}).setDMPermission(false);
		opt.addOption('tag-3', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option
				.setName('edit')
				.setDescription('Edit a tag')
				.addOption('name', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('name').setDescription('The name of the tag').setRequired(true);
				})
				.addOption('content', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('content').setDescription('The content of the tag').setRequired(true);
				});
		}).setDMPermission(false);
		opt
			.addOption('tag-4', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
				option.setName('list').setDescription('List all tags in this server');
			})
			.setDMPermission(false),
			opt
				.addOption('tag-5', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
					option
						.setName('view')
						.setDescription('View a tag')
						.addOption('name', ApplicationCommandOptionTypes.STRING, (option) => {
							option.setName('name').setDescription('The name of the tag').setRequired(true);
						})
						.addOption('mention', ApplicationCommandOptionTypes.USER, (option) => {
							option.setName('mention').setDescription('Mention a user in the tag');
						});
				})
				.setDMPermission(false);
		opt.addOption('tag-5', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option.setName('clear').setDescription('Delete all tags in this server');
		}).setDMPermission(false);
	},
	run: async (instance, interaction) => {
		const subCommand = interaction.data.options.getSubCommand(true);

		if (subCommand.find((name) => name === 'create')) return await handleCreate(instance, interaction);
		if (subCommand.find((name) => name === 'delete')) return await handleDelete(instance, interaction);

		if (subCommand.find((name) => name === 'edit')) return await handleEdit(instance, interaction);

		if (subCommand.find((name) => name === 'list')) return await handleList(instance, interaction);

		if (subCommand.find((name) => name === 'view')) return await handleView(instance, interaction);

		if (subCommand.find((name) => name === 'clear')) return await handleClear(instance, interaction);

		return await interaction.createFollowup({
			content: 'Invalid subcommand!',
			flags: MessageFlags.EPHEMERAL
		});
	}
});
