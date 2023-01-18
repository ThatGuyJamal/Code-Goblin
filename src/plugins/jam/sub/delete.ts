import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags } from 'oceanic.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	const jam = await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id);

	if (!jam) return await interaction.createFollowup({ content: `No current Code Jam found in __${interaction.guild!.name}__` });

	// Check
	if (!interaction.member?.permissions.has('MANAGE_GUILD') || jam.created_by_id !== interaction.member.user.id) {
		return await interaction.createFollowup({
			content: `You are not the creator of this Code Jam or you do not have the \`MANAGE_GUILD\` permission!\n\nThis Code Jam was not deleted.`,
			flags: MessageFlags.EPHEMERAL
		});
	}

	await instance.collections.commands.plugins.jam.deleteCodeJam(interaction.guild!.id);

	await interaction.createFollowup({
		content: `Successfully deleted the Code Jam in __${interaction.guild!.name}__!`,
		flags: MessageFlags.EPHEMERAL
	});
}
