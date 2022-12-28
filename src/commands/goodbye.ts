import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes } from 'oceanic.js';
import { CreateCommand } from '../cmd/command.js';
import { isCanary } from '../config/config.js';
import constants from '../utils/constants.js';

export default CreateCommand({
	trigger: 'goodbye',
	description: 'Goodbye plugin',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: isCanary ? 'guild' : 'global',
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

		if (!interaction.guild) return;

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
