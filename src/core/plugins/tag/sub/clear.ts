import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags, Permissions } from 'oceanic.js';
import { constants } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	if (!interaction.member?.permissions.has(Permissions.MANAGE_GUILD)) {
		return await interaction.createFollowup({
			content: `You need the following permissions: \`Manage Server\` to execute this command.`,
			flags: MessageFlags.EPHEMERAL
		});
	}

	await instance.collections.controllers.tags.ClearTags(interaction.guild!.id);

	return await interaction.createFollowup({
		embeds: [
			{
				description: instance.utils.stripIndents(
					`
\`\`\`asciidoc
• Success :: Tags have been cleared!
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
