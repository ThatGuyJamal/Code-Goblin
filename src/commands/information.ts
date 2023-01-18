import { EmbedBuilder } from '@oceanicjs/builders';
import { ApplicationCommandTypes, ButtonStyles, ComponentTypes } from 'oceanic.js';
import { client } from '../client/client.js';
import { CreateCommand } from '../command.js';
import config, { isCanary } from '../config/config.js';
import constants from '../constants.js';
import { GlobalStatistics, GlobalStatsModel } from '../database/schemas/statistics.js';
import os from 'node:os';

function getCpuUsage() {
	const cpus = os.cpus();
	let idleCpu = 0;
	let totalCpu = 0;

	for (const cpu of cpus) {
		for (const type in cpu.times) {
			//@ts-ignore
			totalCpu += cpu.times[type];
		}
		idleCpu += cpu.times.idle;
	}
	return {
		usage: 100 - ~~((100 * idleCpu) / totalCpu),
		cores: cpus.length
	};
}

function getMemoryUsage() {
	const freeMem = os.freemem();
	const totalMem = os.totalmem();
	return {
		usage: ~~(((totalMem - freeMem) / totalMem) * 100),
		total: ~~((totalMem / totalMem) * 100),
		free: ~~((freeMem / totalMem) * 100)
	};
}

export default CreateCommand({
	trigger: 'info',
	description: 'View information about the bot and its services',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: isCanary ? 'guild' : 'global',
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	options: (opts) => {},
	run: async (instance, interaction) => {
		const plugins = instance.collections.commands.plugins;

		let embed = new EmbedBuilder();

		let statusCode = instance.database.network_status();
		const global = (await GlobalStatsModel.findOne({ id: 'global' })) as GlobalStatistics;

		embed.setTitle('Bot Statistics');
		embed.setDescription('Displaying current data below');
		embed.setColor(constants.numbers.colors.primary);

		embed.addField('CPU', `Usage: ${getCpuUsage().usage}%\nCores: ${getCpuUsage().cores}`, true);
		embed.addField('Memory', `Usage: ${getMemoryUsage().usage}%\nFree: ${getMemoryUsage().free}%\nTotal: ${getMemoryUsage().total}%`, true);

		embed.addField('Guilds Cached', `${client.guilds.size}`, true);
		embed.addField('Guilds Joined', `${global.guilds_joined}`, true);
		embed.addField('Guilds Left', `${global.guilds_left}`, true);

		embed.addField('Users Cached', `${client.users.size}`, true);

		embed.addField('Discord API Library', `[Oceanic.js-v1.4.1](https://oceanic.ws)`, true);
		embed.addField('Database State', `${statusCode ? 'Online' : 'Offline'}`, true);

		embed.addField('Total Commands', `${instance.collections.commands.commandStoreMap.size}`, true);
		embed.addField('Commands Executed', `${global.commands_executed}`, true);
		embed.addField('Commands Failed', `${global.commands_failed}`, true);

		embed.addField(
			'Cached Plugins',
			`Tags: ${plugins.tags.cache.size}, Welcome: ${plugins.welcome.cache.size}, Goodbye: ${plugins.goodbye.cache.size}, Jams: ${plugins.jam.cache.size}`,
			true
		);

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
							url: config.whisper_room.url,
							disabled: true
						}
					]
				}
			]
		});
	}
});
