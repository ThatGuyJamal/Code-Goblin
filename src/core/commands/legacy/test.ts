import { CreateLegacyCommand } from '../../structures/command.js';
import config from '../../../config/config.js';

export default CreateLegacyCommand({
	trigger: 'test',
	description: `Test a function in the bot`,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
    devOnly: true,
    guildLock: config.DevelopmentServerIds,
	run: async ({ instance, message, args }) => {
        await message.channel?.createMessage({ content: `Not implemented yet`})
    }
});
