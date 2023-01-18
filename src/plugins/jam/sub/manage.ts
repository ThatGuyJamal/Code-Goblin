import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags } from 'oceanic.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	const jam = await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id);

	if (!jam) return await interaction.createFollowup({ content: `No current Code Jam found in __${interaction.guild!.name}__` });

	// Check
	if (!interaction.member?.permissions.has('MANAGE_GUILD') || jam.event_managers_ids?.includes(interaction.member!.id)) {
		return await interaction.createFollowup({
			content: `You do not have permission to manage this Code Jam!`,
			flags: MessageFlags.EPHEMERAL
		});
	}

	const manageName = interaction.data.options.getString('manage-name');
	const manageDescription = interaction.data.options.getString('manage-description');
	const manageEventType = interaction.data.options.getString('manage-event-type');
	const manageEventChannel = interaction.data.options.getChannel('manage-event-channel');
	const manageEventRole = interaction.data.options.getRole('manage-event-role');
	const manageEventManagerRole = interaction.data.options.getRole('manage-event-manager-role');
	const manageEventImage = interaction.data.options.getString('manage-event-image');

	const manageAddParticipant = interaction.data.options.getUser('manage-add-participant');
	const manageRemoveParticipant = interaction.data.options.getUser('manage-remove-participant');

	const manageAddManager = interaction.data.options.getUser('manage-add-manager');
	const manageRemoveManager = interaction.data.options.getUser('manage-remove-manager');

	const manageEventStart = interaction.data.options.getString('manage-event-start');
	const manageEventEnd = interaction.data.options.getString('manage-event-end');

	let changes: string[] = [];

	// if no options are provided, return
	if (
		!manageName &&
		!manageDescription &&
		!manageEventType &&
		!manageEventChannel &&
		!manageEventRole &&
		!manageEventImage &&
		!manageAddParticipant &&
		!manageRemoveParticipant &&
		!manageAddManager &&
		!manageRemoveManager &&
		!manageEventStart &&
		!manageEventEnd &&
		!manageEventManagerRole &&
		!manageEventImage
	) {
		return await interaction.createFollowup({
			content: `You must provide at least one option to manage the Code Jam!`,
			flags: MessageFlags.EPHEMERAL
		});
	}

	if (manageAddParticipant) {
		if (manageAddParticipant.id === interaction.member.user.id) {
			return await interaction.createFollowup({
				content: `You cannot add yourself to the Code Jam as a participant! Please use the \`/jam join\` command instead!`,
				flags: MessageFlags.EPHEMERAL
			});
		}

		if (manageAddParticipant.id === interaction.client.user.id) {
			return await interaction.createFollowup({
				content: `You cannot add me to the Code Jam as a participant!`,
				flags: MessageFlags.EPHEMERAL
			});
		}

		await instance.collections.commands.plugins.jam.addJamParticipant(interaction.guild!.id, manageAddParticipant.id);

		const role = interaction.guild?.roles.get(jam.event_role_id!);
		const member = interaction.guild?.members.get(manageAddParticipant.id);

		if (!role) {
			changes.push(`Failed to add <@${manageAddParticipant.id}> as a participant. The event role was not found!`);
		} else {
			await member?.addRole(role.id, `Joined Code Jam`).catch(() => {});
			changes.push(`Added <@${manageAddParticipant.id}> as a participant`);
		}
	}

	if (manageName) {
		await instance.collections.commands.plugins.jam.updateJamName(interaction.guild!.id, manageName);

		changes.push(`Updated the name to \`${manageName}\``);
	}

	if (manageDescription) {
		await instance.collections.commands.plugins.jam.updateCodeJamDescription(interaction.guild!.id, manageDescription);

		changes.push(`Updated the description.`);
	}

	if (manageEventType) {
		// TODO - implement this
	}

	if (manageEventChannel) {
		await instance.collections.commands.plugins.jam.updateCodeJamChannel(interaction.guild!.id, manageEventChannel.id);

		changes.push(`Updated the event channel to <#${manageEventChannel.id}>`);
	}

	if (manageEventRole) {
		await instance.collections.commands.plugins.jam.updateCodeJamRole(interaction.guild!.id, manageEventRole.id);

		changes.push(`Updated the event role to <@&${manageEventRole.id}>`);
	}

	// TODO - Make it so if this role is updated, it updates the role for all participants
	if (manageEventManagerRole) {
		await instance.collections.commands.plugins.jam.updateCodeJamManagerRole(interaction.guild!.id, manageEventManagerRole.id);

		const role = interaction.guild?.roles.get(jam.event_managers_role_id!);

		if (!role) {
			changes.push(`Failed to add <@${manageEventManagerRole.id}> as a manager. The event role was not found!`);
		} else {
			await interaction.member?.addRole(role.id, `Joined Code Jam`).catch(() => {});
			changes.push(`Added <@${manageEventManagerRole.id}> as a manager`);
		}
	}

	if (manageEventImage) {
		await instance.collections.commands.plugins.jam.updateCodeJamImage(interaction.guild!.id, manageEventImage);

		changes.push(`Updated the event image to \`${manageEventImage}\``);
	}

	if (manageRemoveParticipant) {
		await instance.collections.commands.plugins.jam.removeJamParticipant(interaction.guild!.id, manageRemoveParticipant.id);

		const role = interaction.guild?.roles.get(jam.event_role_id!);
		const member = interaction.guild?.members.get(manageRemoveParticipant.id);

		if (!role) {
			changes.push(`Failed to remove <@${manageRemoveParticipant.id}> as a participant. The event role was not found!`);
		} else {
			await member?.removeRole(role.id, `Left Code Jam`).catch(() => {});
			changes.push(`Removed <@${manageRemoveParticipant.id}> as a participant`);
		}
	}

	if (manageAddManager) {
		await instance.collections.commands.plugins.jam.addJamManager(interaction.guild!.id, manageAddManager.id);

		const role = interaction.guild?.roles.get(jam.event_managers_role_id!);
		const member = interaction.guild?.members.get(manageAddManager.id);

		if (!role) {
			changes.push(`Failed to add <@${manageAddManager.id}> as a manager. The event role was not found!`);
		} else {
			await member?.addRole(role.id, `Joined Code Jam`).catch(() => {});
			changes.push(`Added <@${manageAddManager.id}> as a manager`);
		}
	}

	if (manageRemoveManager) {
		await instance.collections.commands.plugins.jam.removeJamManager(interaction.guild!.id, manageRemoveManager.id);

		const role = interaction.guild?.roles.get(jam.event_managers_role_id!);
		const member = interaction.guild?.members.get(manageRemoveManager.id);

		if (!role) {
			changes.push(`Failed to remove <@${manageRemoveManager.id}> as a manager. The event role was not found!`);
		} else {
			await member?.removeRole(role.id, `Left Code Jam`).catch(() => {});
			changes.push(`Removed <@${manageRemoveManager.id}> as a manager`);
		}
	}

	if (manageEventStart) {
		let format = instance.utils.convertDateStringToDiscordTimeStamp(manageEventStart, 'd');

		await instance.collections.commands.plugins.jam.updateCodeJamStartDate(interaction.guild!.id, format);

		changes.push(`Updated the event start date to ${format}`);
	}

	if (manageEventEnd) {
		let format = instance.utils.convertDateStringToDiscordTimeStamp(manageEventEnd, 'd');

		await instance.collections.commands.plugins.jam.updateCodeJamEndDate(interaction.guild!.id, format);

		changes.push(`Updated the event end date to ${format}`);
	}

	await interaction.createFollowup({
		content: `Successfully updated the Code Jam!\n\n**Changes:**\n${changes.map((change, index) => `${index + 1}. ${change}`).join('\n')}`,
		flags: MessageFlags.EPHEMERAL,
		allowedMentions: {
			users: false,
			roles: false,
			repliedUser: true
		}
	});
}
