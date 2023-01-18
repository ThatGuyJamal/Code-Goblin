import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	const jam = await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id);

	if (jam?.event_participants_ids?.includes(interaction.member!.id))
		return await interaction.createFollowup({ content: `You are not in this Code Jam!` });

	if (!jam) return await interaction.createFollowup({ content: `You can only leave a Jam during an active event.` });

	const role = interaction.guild?.roles.get(jam.event_role_id!);

	if (!role) return await interaction.createFollowup({ content: `The role for this Code Jam does not exist! We cant remove you...` });

	await interaction.member?.removeRole(role.id, 'Left Code Jam').catch(() => {});

	await instance.collections.commands.plugins.jam.removeJamParticipant(interaction.guild!.id, interaction.member!.id);

	await interaction.createFollowup({ content: `You have successfully left the Code Jam!` });
}
