import { RateLimitManager } from '@sapphire/ratelimits';
import { ApplicationCommandTypes, MessageFlags } from 'oceanic.js';
import { isCanary } from '../../config/config.js';
import { Milliseconds } from '../../utils/constants.js';
import { constants } from '../../utils/index.js';
import { CreateCommand } from '../structures/command.js';

export default CreateCommand({
	trigger: 'ping',
	description: `Checks the bots latency`,
	type: ApplicationCommandTypes.CHAT_INPUT,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	register: isCanary ? 'guild' : 'global',
	ratelimit: {
		user: new RateLimitManager(Milliseconds.SECOND * 5, 1),
	},
	run: async ({ instance, interaction }) => {
		await interaction.defer(MessageFlags.LOADING + MessageFlags.EPHEMERAL);

		const defer = await interaction.getOriginal();

		await interaction.editOriginal({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
						\`\`\`asciidoc
						• Latency :: ${defer.createdAt.getTime() - interaction.createdAt.getTime()}ms
						\`\`\`
						`
					),
					color: constants.numbers.colors.primary,
					footer: {
						text: `Requested by ${interaction.user.tag}`
					},
					timestamp: new Date().toISOString()
				}
			],
			flags: MessageFlags.EPHEMERAL
		});
	}
});
