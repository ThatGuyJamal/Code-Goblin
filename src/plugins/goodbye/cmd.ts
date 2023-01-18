import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes } from 'oceanic.js';
import { CreateCommand } from '../../command.js';
import { isCanary } from '../../config/config.js';

import handleConfigure from './sub/configure.js';
import handleView from './sub/view.js';
import handleDelete from './sub/delete.js';

export default CreateCommand({
	trigger: 'goodbye',
	description: 'Goodbye plugin',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: isCanary ? 'guild' : 'global',
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
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
		if (!interaction.guild) return;

		const subCommand = interaction.data.options.getSubCommand(true);

		if (subCommand.find((name) => name === 'configure')) await handleConfigure(instance, interaction);

		if (subCommand.find((name) => name === 'delete')) await handleDelete(instance, interaction);

		if (subCommand.find((name) => name === 'view')) await handleView(instance, interaction);

		return await interaction.createFollowup({
			content: 'Invalid subcommand!'
		});
	}
});
