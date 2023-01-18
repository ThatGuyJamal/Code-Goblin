import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags, Permissions } from 'oceanic.js';
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

	// Check if the tag exists
	const tagExists = instance.collections.commands.plugins.tags.GetTag(interaction.guild!.id, name);

	if (!tagExists) {
		return await interaction.createFollowup({
			content: `Tag \`${name}\` doesn't exist!`,
			flags: MessageFlags.EPHEMERAL
		});
	}

	await instance.collections.commands.plugins.tags.DeleteTag(interaction.guild!.id, name);

	return await interaction.createFollowup({
		content: `Tag deleted!`,
		flags: MessageFlags.EPHEMERAL
	});
}
