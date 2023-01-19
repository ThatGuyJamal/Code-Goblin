import { ApplicationCommandTypes, MessageFlags } from 'oceanic.js';
import { CreateCommand } from '../command.js';
import { isCanary } from '../config/config.js';
import constants from '../constants.js';

export default CreateCommand({
	trigger: 'ping',
	description: `Checks the bots latency`,
	type: ApplicationCommandTypes.CHAT_INPUT,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	options: (opt) => {},
	register: isCanary ? 'guild' : 'global',
	run: async (_instance, interaction) => {
		await interaction.defer(MessageFlags.LOADING + MessageFlags.EPHEMERAL);

		const defer = await interaction.getOriginal();

		await interaction.editOriginal({
			embeds: [
				{
					title: `Latency: ${defer.createdAt.getTime() - interaction.createdAt.getTime()}ms`,
					color: constants.numbers.colors.primary
				}
			],
			flags: MessageFlags.EPHEMERAL
		});
	}
});
