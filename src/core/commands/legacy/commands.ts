
import config from '../../../config/config.js';
import { constants } from '../../../utils/index.js';
import { CreateLegacyCommand } from '../../structures/command.js';

export default CreateLegacyCommand({
	trigger: 'commands',
	description: `List all legacy commands`,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
    devOnly: true,
	run: async ({ instance, message, args }) => {
        const commands = instance.collections.commands.legacyCommandStoreMap.map((command) => command.trigger).join(', ');

		return await message.channel?.createMessage({
			embeds: [
				{
					title: 'Legacy Commands',
					description: instance.utils.codeBlock(commands),
					color: constants.numbers.colors.primary,
					fields: [{ 
						name: `Prefix`,
						value: config.BotPrefix,
						inline: true
					}],
				}
			]
		});
    }
});
