import { EmbedBuilder } from '@oceanicjs/builders';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ButtonStyles, ComponentTypes } from 'oceanic.js';
import { client } from '../client.js';
import { CreateCommand } from '../command.js';
import constants from '../constants.js';
import ms from 'ms';
import config from '../config/config.js';

export default CreateCommand({
	trigger: 'information',
	description: 'View information about the bot and its services',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: {
		guild: true,
		global: false
	},
	options: (opts) => {
		opts.addOption('option', ApplicationCommandOptionTypes.STRING, (option) => {
			option
				.setName('type')
				.setDescription('The type of statistics to show')
				.addChoice('Company', 'company')
				.addChoice('Bot', 'bot')
				.setRequired(true);
		}).setDMPermission(false);
	},
	run: async (instance, interaction) => {
		const type = interaction.data.options.getStringOption('type', true);

		let embed = new EmbedBuilder();

		if (type.value === 'company') {
			let statusCode = instance.database.network_status();

			embed.setTitle(constants.strings.commands.statistics.embed_title_1);
			embed.addField(constants.strings.commands.statistics.embed_field_1_1, statusCode ? 'Online' : 'Offline');
			embed.setDescription(constants.strings.commands.statistics.embed_description_1);

			embed.addField(constants.strings.commands.statistics.embed_field_1_2, `${client.guilds.size}`, true);
			embed.addField(constants.strings.commands.statistics.embed_field_1_3, `${client.users.size}`, true);

			if (statusCode) {
				embed.setColor(0x00ff00);
			} else {
				embed.setColor(0xff0000);
			}

			await interaction.createMessage({
				embeds: [embed.toJSON()],
				components: [
					{
						type: ComponentTypes.ACTION_ROW,
						components: [
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Invite Me',
								url: config.DevelopmentServerInviteUrl
							},
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Whisper Room',
								url: config.whisper_room.url
							}
						]
					}
				]
			});
		} else if (type.value === 'bot') {
			embed.setTitle('Bot Statistics');
			embed.setDescription('The current bot statistics for the bot');

			embed.addField(constants.strings.commands.statistics.embed_field_2_1, `${client.shards.size}`, true);
			embed.addField(constants.strings.commands.statistics.embed_field_2_2, `${client.guilds.size}`, true);
			embed.addField(constants.strings.commands.statistics.embed_field_2_3, `${client.users.size}`, true);
			embed.addField(constants.strings.commands.statistics.embed_field_2_5, `${instance.collections.commands.commandStoreMap.size}`, true);
			embed.addField(constants.strings.commands.statistics.embed_field_2_6, `${ms(client.uptime)}`, true);
			embed.addField(
				constants.strings.commands.statistics.embed_field_2_7,
				`${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
				true
			);
			embed.addField(constants.strings.commands.statistics.embed_field_2_8, `${Math.round(process.cpuUsage().user / 1000)}ms`, true);
			embed.addField(constants.strings.commands.statistics.embed_field_2_9, `${process.version}`, true);
			embed.addField(constants.strings.commands.statistics.embed_field_2_10, `oceanic.js-v1.3.2`, true);

			await interaction.createMessage({
				embeds: [embed.toJSON()],
				components: [
					{
						type: ComponentTypes.ACTION_ROW,
						components: [
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Invite Me',
								url: config.DevelopmentServerInviteUrl
							},
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Whisper Room',
								url: config.whisper_room.url
							}
						]
					}
				]
			});
		}
	}
});
