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
	const content = interaction.data.options.getString('content', true);

	// Check if the tag exists
	const tagExists = instance.collections.commands.plugins.tags.GetTag(interaction.guild!.id, name);

	if (!tagExists) {
		return await interaction.createFollowup({
			content: `Tag \`${name}\` doesn't exist!`,
			flags: MessageFlags.EPHEMERAL
		});
	}

	const tag = await instance.collections.commands.plugins.tags.UpdateTag(interaction.guild!.id, name, content);

	return await interaction.createFollowup({
		content: `Tag \`${tag.name}\` edited!`,
		flags: MessageFlags.EPHEMERAL
	});
}
