import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags } from 'oceanic.js';
import { constants } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer(64);

	const data = await instance.collections.controllers.goodbye.GetGoodbye(interaction.guild!.id);

	const { utils } = instance;

	if (!data) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: Goodbye plugin has not been configured!
\`\`\`
`
					),
					color: constants.numbers.colors.secondary,
					timestamp: new Date().toISOString()
				}
			],
			flags: MessageFlags.EPHEMERAL
		});
	}

	return await interaction.createFollowup({
		embeds: [
			{
				description: utils.stripIndents(
					`
\`\`\`asciidoc
• Success :: Showing goodbye plugin data!
\`\`\`
`
				),
				fields: [
					{
						name: 'Config:',
						value: utils.stripIndents(`
**Channel:** __${utils.channelMention(data.channel_id)}__

**Content:**
\`\`\`
${data.content}
\`\`\`
`),
						inline: false
					}
				],
				color: constants.numbers.colors.secondary,
				timestamp: new Date().toISOString()
			}
		]
	});
}
