import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags, Permissions } from 'oceanic.js';
import { TagLimits } from '../../../database/schemas/tag.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();
	if (!interaction.member?.permissions.has(Permissions.MANAGE_MESSAGES)) {
		return await interaction.createFollowup({
			content: `You need the following permissions: \`Manage Messages\` to execute this command.`,
			flags: MessageFlags.EPHEMERAL
		});
	}

	const name = interaction.data.options.getString('name', true);
	const content = interaction.data.options.getString('content', true);

	// Check if the tax limit has been reached
	const tagLimits = await instance.collections.commands.plugins.tags.GetTagLimits(interaction.guild!.id);

	if (tagLimits.limited) {
		return await interaction.createFollowup({
			content: `You have reached the max tag limit of \`${TagLimits.MAX_CREATED_TAGS}\`! You can delete a current tag and create a new one. Run \`/tag list\` to view all current tags in the server.`,
			flags: MessageFlags.EPHEMERAL
		});
	}

	// Check if the tag already exists
	const tagExists = await instance.collections.commands.plugins.tags.GetTag(interaction.guild!.id, name);

	if (tagExists) {
		return await interaction.createFollowup({
			content: `Tag \`${name}\` already exists!`,
			flags: MessageFlags.EPHEMERAL
		});
	}

	const tag = await instance.collections.commands.plugins.tags.CreateTag(
		interaction.guild!.id,
		name,
		content,
		interaction.user.id,
		interaction.user.tag
	);

	return await interaction.createFollowup({
		content: `Tag \`${tag.name}\` created!`,
		flags: MessageFlags.EPHEMERAL
	});
}
