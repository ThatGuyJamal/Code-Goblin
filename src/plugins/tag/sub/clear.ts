import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags, Permissions } from 'oceanic.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	if (!interaction.member?.permissions.has(Permissions.MANAGE_GUILD)) {
		return await interaction.createFollowup({
			content: `You need the following permissions: \`Manage Server\` to execute this command.`,
			flags: MessageFlags.EPHEMERAL
		});
	}

	await instance.collections.commands.plugins.tags.ClearTags(interaction.guild!.id);

	return await interaction.createFollowup({
		content: `All tags cleared!`,
		flags: MessageFlags.EPHEMERAL
	});
}
