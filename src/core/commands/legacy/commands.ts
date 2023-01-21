import { RateLimitManager } from '@sapphire/ratelimits';
import config from '../../../config/config.js';
import { Milliseconds } from '../../../utils/constants.js';
import { constants } from '../../../utils/index.js';
import { CreateLegacyCommand } from '../../structures/command.js';

export default CreateLegacyCommand({
	trigger: 'commands',
	description: `List all legacy commands`,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	devOnly: true,
	ratelimit: {
		user: new RateLimitManager(Milliseconds.SECOND * 10, 1)
	},
	run: async ({ instance, message, args }) => {
		const commands = instance.collections.commands.legacyCommandStoreMap.map((command) => command.trigger).join(', ');

		return await message.channel?.createMessage({
			embeds: [
				{
					title: 'Legacy Commands',
					description: instance.utils.codeBlock(commands),
					color: constants.numbers.colors.primary,
					fields: [
						{
							name: `Bot Prefix`,
							value: `\`${config.BotPrefix}\``,
							inline: true
						}
					]
				}
			]
		});
	}
});
