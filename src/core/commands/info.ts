import { ApplicationCommandTypes, ButtonStyles, ComponentTypes } from 'oceanic.js';
import os from 'node:os';

import config from '../../config/config.js';
import { isCanary } from '../../config/config.js';
import { CreateCommand } from '../structures/command.js';
import { constants } from '../../utils/index.js';
import { GlobalStatsModel } from '../../database/index.js';
import type { GlobalStatistics } from '../../typings/database/types.js';

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
	description: 'View general bot and api information',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: isCanary ? 'guild' : 'global',
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	options: (opts) => {},
	run: async ({instance, interaction}) => {
		const global = (await GlobalStatsModel.findOne({ find_id: 'global' })) as GlobalStatistics;
		let dbStatus = instance.database.network_status();

		const { guilds, users } = instance.DiscordClient;

		let pluginSize =
			instance.collections.controllers.goodbye.cache.size +
			instance.collections.controllers.welcome.cache.size +
			instance.collections.controllers.tags.cache.size +
			instance.collections.controllers.jam.cache.size;

		await interaction.createMessage({
			embeds: [
				{
					description: instance.utils.stripIndents(`
**Bot Information**
\`\`\`asciidoc
• CPU Usage         :: ${getCpuUsage().usage}/100%
• Memory Usage      :: ${getMemoryUsage().usage}/${getMemoryUsage().total}%
• Guilds Cached     :: ${guilds.size}
• Users Cached      :: ${users.size}
• Bot API Library   :: Oceanic.js-v1.4.1
• Bot Language      :: TypeScript
• Bot Developer     :: ${config.DeveloperTag}
\`\`\`
**Global Information**
\`\`\`asciidoc
• Guilds Joined     :: ${global.guilds_joined}
• Guilds Left       :: ${global.guilds_left}
• Commands Executed :: ${global.commands_executed}
• Commands Failed   :: ${global.commands_failed}
• Plugins Loaded    :: ${pluginSize}
• Database Status   :: ${dbStatus.connected ? 'Connected' : 'Disconnected'}
\`\`\`
`),
					color: constants.numbers.colors.secondary,
					thumbnail: {
						url: instance.DiscordClient.user.avatarURL('png', 1024)
					},
					footer: {
						text: `Requested by ${interaction.user.tag}`
					},
					timestamp: new Date().toISOString()
				}
			],
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
