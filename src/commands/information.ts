import { EmbedBuilder } from '@oceanicjs/builders';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ButtonStyles, ComponentTypes } from 'oceanic.js';
import { client } from '../client.js';
import { CreateCommand } from '../command.js';
import ms from 'ms';
import config from '../config/config.js';
import constants from '../constants.js';
import { GlobalStatistics, GlobalStatsModel } from '../database/schemas/statistics.js';

export default CreateCommand({
	trigger: 'information',
	description: 'View information about the bot and its services',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: 'global',
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
	requiredUserPermissions: ['SEND_MESSAGES', 'MANAGE_GUILD'],
	options: (opts) => {
		opts.addOption('option', ApplicationCommandOptionTypes.STRING, (option) => {
			option
				.setName('type')
				.setDescription('The type of statistics to show')
				.addChoice('Bot', 'bot')
				.addChoice('Company', 'company')
				.setRequired(true);
		}).setDMPermission(false);
	},
	run: async (instance, interaction) => {
		const type = interaction.data.options.getStringOption('type', true);

		let embed = new EmbedBuilder();

		if (type.value === 'company') {
			embed.setTitle('Company Statistics');
			embed.setDescription('About the developers of Whisper Room');
			embed.addField('About', constants.strings.commands.info.company.bio, true);
			embed.setColor(constants.numbers.colors.primary);

			await interaction.createMessage({
				embeds: [embed.toJSON()],
				components: [
					{
						type: ComponentTypes.ACTION_ROW,
						components: [
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Invite Bot',
								url: config.BotClientOAuth2Url
							},
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Code Repository',
								url: config.GithubRepository
							},
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Website',
								url: config.whisper_room.url
							}
						]
					}
				]
			});
		} else if (type.value === 'bot') {
			let statusCode = instance.database.network_status();
			const global = (await GlobalStatsModel.findOne({ id: 'global' })) as GlobalStatistics;

			embed.setTitle('Bot Statistics');
			embed.setDescription('Displaying current data below');
			embed.setColor(constants.numbers.colors.primary);

			let cpuUsage = process.cpuUsage();
			let cpuUsagePercentage = (cpuUsage.user + cpuUsage.system) / 1000 / 1000 / 1000 / 1000;

			embed.addField('CPU Usage', `${cpuUsagePercentage.toFixed(2)}%`, true);
			embed.addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true);

			embed.addField('Uptime', ms(client.uptime, { long: true }), true);

			embed.addField('Guilds Cached', `${client.guilds.size}`, true);
			embed.addField('Guilds Joined', `${global.guilds_joined}`, true);
			embed.addField('Guilds Left', `${global.guilds_left}`, true);

			embed.addField('Users Cached', `${client.users.size}`, true);

			embed.addField('Discord API Library', `[Oceanic.js-v1.4.0](https://oceanic.ws/)`, true);
			embed.addField('Database State', `${statusCode ? 'Online' : 'Offline'}`, true);

			embed.addField('Total Commands', `${instance.collections.commands.commandStoreMap.size}`, true);
			embed.addField('Commands Executed', `${global.commands_executed}`, true);
			embed.addField('Commands Failed', `${global.commands_failed}`, true);

			await interaction.createMessage({
				embeds: [embed.toJSON()],
				components: [
					{
						type: ComponentTypes.ACTION_ROW,
						components: [
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Invite Bot',
								url: config.BotClientOAuth2Url
							},
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Code Repository',
								url: config.GithubRepository
							},
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Website',
								url: config.whisper_room.url
							}
						]
					}
				]
			});
		}
	}
});
