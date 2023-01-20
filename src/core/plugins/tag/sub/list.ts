import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags } from 'oceanic.js';
import constants from '../../../../utils/constants.js';
import { logger } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();
	const tags = await instance.collections.controllers.tags.GetTags(interaction.guild!.id);

	const noTags: boolean = tags.length === 0;

	let tString = noTags ? '• Error :: No tags to list in this server' : tags.map((tag) => `• Tag :: ${tag.name}`).join('\n')

	await interaction
		.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
${tString}
\`\`\`
`
							// todo - fix this hack
							// hack to remove }} from the end of the embed description.
							// .slice(0, -2)
					),
					color: constants.numbers.colors.secondary,
					timestamp: new Date().toISOString()
				}
			],
			flags: MessageFlags.EPHEMERAL
		})
		.catch((err) => {
			logger.error(err);
			instance.utils.sendToLogChannel(
				'error',
				`Error sending tag list to ${interaction.user.tag} (${interaction.user.id}) in ${interaction.guild!.name} (${interaction.guild!.id})`
			);
		});
}
