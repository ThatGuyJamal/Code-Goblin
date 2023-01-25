import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import { constants } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer(64);

	const channel = interaction.data.options.getChannel('channel', true);
	const context = interaction.data.options.getString('context', true);

	await instance.database.schemas.automation.welcome.CreateWelcome({
		guild_id: interaction.guild!.id,
		channel_id: channel.id,
		content: context,
		enabled: true
	});

	return await interaction.createFollowup({
		embeds: [
			{
				description: instance.utils.stripIndents(
					`
\`\`\`asciidoc
• Success :: Welcome plugin has been configured!
\`\`\`
`
				),
				color: constants.numbers.colors.secondary,
				timestamp: new Date().toISOString()
			}
		],
		flags: 64
	});
}
