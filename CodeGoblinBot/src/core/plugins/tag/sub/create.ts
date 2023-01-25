import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags, Permissions } from 'oceanic.js';
import { TagLimits } from '../../../../typings/database/types.js';
import { constants } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer(64);

	if (!interaction.member?.permissions.has(Permissions.MANAGE_MESSAGES)) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: You need the following permissions: \`Manage Messages\` to execute this command.
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

	const c_name = interaction.data.options.getString('name', true);
	const c_content = interaction.data.options.getString('content', true);

	// Check if the tax limit has been reached
	const tagLimits = await instance.database.schemas.tag.CheckIfLimited(interaction.guild!.id);

	if (tagLimits) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: You have reached the max tag limit of ${TagLimits.MAX_CREATED_TAGS}! You can delete a tag to create a new one.
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

	// Check if the tag already exists
	const tagExists = await instance.database.schemas.tag.CheckIfTagExists(interaction.guild!.id, c_name);

	if (tagExists) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: Tag \`${c_name}\` already exists!
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

	await instance.database.schemas.tag.CreateTag({
		guild_id: interaction.guild!.id,
		name: c_name,
		content: c_content,
		created_by_name: interaction.user.username,
		created_by_id: interaction.user.id
	});

	return await interaction.createFollowup({
		embeds: [
			{
				description: instance.utils.stripIndents(
					`
\`\`\`asciidoc
• Success :: Tag \`${c_name}\` has been created!
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
