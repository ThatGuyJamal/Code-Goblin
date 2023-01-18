import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import { logger } from '../../../index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	await interaction.createFollowup({
		content: `Ending the Code Jam...`
	});

	try {
		const jam = await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id);

		if (!jam) return await interaction.createFollowup({ content: `No current Code Jam found in __${interaction.guild!.name}__` });

		let participants = jam.event_participants_ids ?? [];
		let managers = jam.event_managers_ids ?? [];
		let pRole = interaction.guild!.roles.get(jam.event_role_id!);
		let mRole = interaction.guild!.roles.get(jam.event_managers_role_id!);

		if (!pRole && !mRole || !pRole || !mRole) {
			return await interaction.editOriginal({
				content: `The event role and event managers role is not set! Please check the data with ${instance.utils.codeBlock('/jam manage')}`
			});
		}

		await interaction.editOriginal({
			content: `Removing all participants from the event...`
		});

		if (!jam.event_role_id)
			return await interaction.editOriginal({
				content: `The event role ID is not set!`
			});

		if (!jam.event_managers_role_id)
			return await interaction.editOriginal({
				content: `The event managers role ID is not set!`
			});

		// Remove all participants from the event
		for (const participant of participants) {
			let member = interaction.guild!.members.get(participant);

			if (!member) continue;

			await member.removeRole(pRole.id, 'Code Jam ended!');
		}

		await interaction.editOriginal({
			content: `Removing all managers from the event...`
		});

		// Remove all managers from the event
		for (const manager of managers) {
			let member = interaction.guild!.members.get(manager);

			if (!member) continue;

			await member.removeRole(mRole.id, 'Code Jam ended!');
		}

		await interaction.editOriginal({
			content: `Deleting Event Data...`
		});

		await instance.collections.commands.plugins.jam.deleteCodeJam(interaction.guild!.id);

		return await interaction.editOriginal({
			content: `Code Jam ended!`
		});
	} catch (error) {
		logger.error(error);
		return await interaction.editOriginal({
			content: `An error occurred while ending the Code Jam!`
		});
	}
}
