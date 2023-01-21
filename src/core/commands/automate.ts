import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes } from 'oceanic.js';

import { isCanary } from '../../config/config.js';
import { CreateCommand } from '../structures/command.js';

import handleWelcomeConfigure from '../plugins/welcome/sub/configure.js';
import handleWelcomeView from '../plugins/welcome/sub/view.js';
import handleWelcomeDelete from '../plugins/welcome/sub/delete.js';

import handleGoodbyeConfigure from '../plugins/goodbye/sub/configure.js';
import handleGoodbyeView from '../plugins/goodbye/sub/view.js';
import handleGoodbyeDelete from '../plugins/goodbye/sub/delete.js';

export default CreateCommand({
	trigger: 'automate',
	description: `Automate functions for your server!`,
	type: ApplicationCommandTypes.CHAT_INPUT,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES', 'MANAGE_GUILD'],
	options: (opt) => {
		opt
			.addOption('goodbye', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
				option
					.setName('goodbye-configure')
					.setDescription('configure goodbye settings')
					.addOption('channel', ApplicationCommandOptionTypes.CHANNEL, (option) => {
						option
							.setName('channel')
							.setDescription('The name of the channel to send message events')
							.setRequired(true)
							.setChannelTypes([ChannelTypes.GUILD_TEXT]);
					})
					.addOption('context', ApplicationCommandOptionTypes.STRING, (option) => {
						option.setName('context').setDescription('The context you want to send during user goodbye.').setRequired(true);
					});
			})
			.setDMPermission(false)
			.setDefaultMemberPermissions(['MANAGE_GUILD']),
			opt
				.addOption('goodbye', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
					option.setName('goodbye-delete').setDescription('Delete the goodbye plugin');
				})
				.setDMPermission(false)
				.setDefaultMemberPermissions(['MANAGE_GUILD']),
			opt
				.addOption('goodbye', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
					option.setName('goodbye-view').setDescription('View the current goodbye message');
				})
				.setDMPermission(false);
		opt
			.addOption('welcome', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
				option
					.setName('welcome-configure')
					.setDescription('configure welcome settings')
					.addOption('channel', ApplicationCommandOptionTypes.CHANNEL, (option) => {
						option
							.setName('channel')
							.setDescription('The name of the channel to send message events')
							.setRequired(true)
							.setChannelTypes([ChannelTypes.GUILD_TEXT]);
					})
					.addOption('context', ApplicationCommandOptionTypes.STRING, (option) => {
						option.setName('context').setDescription('The context you want to send during user welcome.').setRequired(true);
					});
			})
			.setDMPermission(false)
			.setDefaultMemberPermissions(['MANAGE_GUILD']),
			opt
				.addOption('welcome', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
					option.setName('welcome-delete').setDescription('Delete the welcome plugin');
				})
				.setDMPermission(false)
				.setDefaultMemberPermissions(['MANAGE_GUILD']),
			opt
				.addOption('welcome', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
					option.setName('welcome-view').setDescription('View the current welcome message');
				})
				.setDMPermission(false);
	},
	register: isCanary ? 'guild' : 'global',
	run: async ({instance, interaction}) => {
		if (!interaction.guild) return;

		const subCommand = interaction.data.options.getSubCommand(true);

		if (subCommand.find((name) => name === 'welcome-configure')) return await handleWelcomeConfigure(instance, interaction);

		if (subCommand.find((name) => name === 'welcome-delete')) return await handleWelcomeDelete(instance, interaction);

		if (subCommand.find((name) => name === 'welcome-view')) return await handleWelcomeView(instance, interaction);

		if (subCommand.find((name) => name === 'goodbye-configure')) return await handleGoodbyeConfigure(instance, interaction);

		if (subCommand.find((name) => name === 'goodbye-delete')) return await handleGoodbyeDelete(instance, interaction);

		if (subCommand.find((name) => name === 'goodbye-view')) return await handleGoodbyeView(instance, interaction);
	}
});
