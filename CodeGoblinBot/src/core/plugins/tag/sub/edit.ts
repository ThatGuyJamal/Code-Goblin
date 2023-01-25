import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags } from 'oceanic.js';
import { constants } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer(64);

	if (!instance.utils.hasPermissions(interaction, 'MANAGE_MESSAGES')) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: You need the following permissions: Manage Messages to execute this command.
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

	const name = interaction.data.options.getString('name', true);
	const content = interaction.data.options.getString('content', true);

	// Check if the tag exists
	const tagExists = instance.database.schemas.tag.GetTag(interaction.guild!.id, name);

	if (!tagExists) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: Tag ${name} doesn't exist!
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

	await instance.database.schemas.tag.UpdateTag({
		guild_id: interaction.guild!.id,
		name: name,
		content: content
	});

	return await interaction.createFollowup({
		embeds: [
			{
				description: instance.utils.stripIndents(
					`
\`\`\`asciidoc
• Success :: Tag ${name} has been updated!
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
