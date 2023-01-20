import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes } from 'oceanic.js';

import { isCanary } from '../../../config/config.js';
import { CreateCommand } from '../../structures/command.js';

import handleConfigure from './sub/configure.js';
import handleView from './sub/view.js';
import handleDelete from './sub/delete.js';

export default CreateCommand({
	trigger: 'welcome',
	description: 'welcome plugin',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: isCanary ? 'guild' : 'global',
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['MANAGE_GUILD'],
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
		if (!interaction.guild) return;

		const subCommand = interaction.data.options.getSubCommand(true);

		if (subCommand.find((name) => name === 'configure')) return await handleConfigure(instance, interaction);

		if (subCommand.find((name) => name === 'delete')) return await handleDelete(instance, interaction);

		if (subCommand.find((name) => name === 'view')) return await handleView(instance, interaction);

		return await interaction.createFollowup({
			content: 'Invalid subcommand!'
		});
	}
});
