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

		if (!interaction.guild) return;

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
