import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import { constants } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	let result = await instance.collections.controllers.welcome.DeleteWelcome(interaction.guild!.id);

	if (!result) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: Welcome plugin has not been configured!
\`\`\`
`
					),
					color: constants.numbers.colors.secondary,
					timestamp: new Date().toISOString()
				}
			]
		});
	}

	await interaction.createFollowup({
		embeds: [
			{
				description: instance.utils.stripIndents(
					`
\`\`\`asciidoc
• Success :: Welcome plugin has been deleted!
\`\`\`
`
				),
				color: constants.numbers.colors.secondary,
				timestamp: new Date().toISOString()
			}
		]
	});
}
