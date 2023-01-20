import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags } from 'oceanic.js';
import { constants } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	const { utils } = instance;

	const jam = await instance.collections.controllers.jam.getCodeJam(interaction.guild!.id);

	if (!jam) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: No current Code Jam found in ${interaction.guild!.name}
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

	// Check
	if (!interaction.member?.permissions.has('MANAGE_GUILD') || jam.event_managers_ids?.includes(interaction.member!.id)) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: You do not have the MANAGE_GUILD permission!
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
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: You must provide at least one option to manage the Code Jam!
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

	if (manageAddParticipant) {
		if (manageAddParticipant.id === interaction.member.user.id) {
			return await interaction.createFollowup({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
\`\`\`asciidoc
• Error :: You cannot add yourself to the Code Jam as a participant!
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

		if (manageAddParticipant.id === interaction.client.user.id) {
			return await interaction.createFollowup({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
\`\`\`asciidoc
• Error :: You cannot the bot to the Code Jam as a participant!
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

		await instance.collections.controllers.jam.addJamParticipant(interaction.guild!.id, manageAddParticipant.id);

		const role = interaction.guild?.roles.get(jam.event_role_id!);
		const member = interaction.guild?.members.get(manageAddParticipant.id);

		if (!role) {
			changes.push(`Failed to add <@${manageAddParticipant.id}> as a participant. The event role was not found!`);
		} else {
			await member?.addRole(role.id, `Joined Code Jam`).catch(() => {});
			changes.push(`Added ${utils.userMention(manageAddParticipant.id)} as a participant`);
		}
	}

	if (manageName) {
		await instance.collections.controllers.jam.updateJamName(interaction.guild!.id, manageName);

		changes.push(`Updated the name to \`${manageName}\``);
	}

	if (manageDescription) {
		await instance.collections.controllers.jam.updateCodeJamDescription(interaction.guild!.id, manageDescription);

		changes.push(`Updated the description.`);
	}

	if (manageEventType) {
		// TODO - implement this
	}

	if (manageEventChannel) {
		await instance.collections.controllers.jam.updateCodeJamChannel(interaction.guild!.id, manageEventChannel.id);

		changes.push(`Updated the event channel to <#${manageEventChannel.id}>`);
	}

	if (manageEventRole) {
		await instance.collections.controllers.jam.updateCodeJamRole(interaction.guild!.id, manageEventRole.id);

		changes.push(`Updated the event role to ${utils.roleMention(manageEventRole.id)}`);
	}

	// TODO - Make it so if this role is updated, it updates the role for all participants
	if (manageEventManagerRole) {
		await instance.collections.controllers.jam.updateCodeJamManagerRole(interaction.guild!.id, manageEventManagerRole.id);

		const role = interaction.guild?.roles.get(jam.event_managers_role_id!);

		if (!role) {
			changes.push(`Failed to add ${utils.roleMention(manageEventManagerRole.id)} as a manager. The event role was not found!`);
		} else {
			await interaction.member?.addRole(role.id, `Joined Code Jam`).catch(() => {});
			changes.push(`Added ${utils.roleMention(manageEventManagerRole.id)} as a manager`);
		}
	}

	if (manageEventImage) {
		await instance.collections.controllers.jam.updateCodeJamImage(interaction.guild!.id, manageEventImage);

		changes.push(`Updated the event image to \`${manageEventImage}\``);
	}

	if (manageRemoveParticipant) {
		await instance.collections.controllers.jam.removeJamParticipant(interaction.guild!.id, manageRemoveParticipant.id);

		const role = interaction.guild?.roles.get(jam.event_role_id!);
		const member = interaction.guild?.members.get(manageRemoveParticipant.id);

		if (!role) {
			changes.push(`Failed to remove ${utils.userMention(manageRemoveParticipant.id)} as a participant. The event role was not found!`);
		} else {
			await member?.removeRole(role.id, `Left Code Jam`).catch(() => {});
			changes.push(`Removed ${utils.userMention(manageRemoveParticipant.id)} as a participant`);
		}
	}

	if (manageAddManager) {
		await instance.collections.controllers.jam.addJamManager(interaction.guild!.id, manageAddManager.id);

		const role = interaction.guild?.roles.get(jam.event_managers_role_id!);
		const member = interaction.guild?.members.get(manageAddManager.id);

		if (!role) {
			changes.push(`Failed to add ${utils.userMention(manageAddManager.id)} as a manager. The event role was not found!`);
		} else {
			await member?.addRole(role.id, `Joined Code Jam`).catch(() => {});
			changes.push(`Added ${utils.userMention(manageAddManager.id)} as a manager`);
		}
	}

	if (manageRemoveManager) {
		await instance.collections.controllers.jam.removeJamManager(interaction.guild!.id, manageRemoveManager.id);

		const role = interaction.guild?.roles.get(jam.event_managers_role_id!);
		const member = interaction.guild?.members.get(manageRemoveManager.id);

		if (!role) {
			changes.push(`Failed to remove ${utils.userMention(manageRemoveManager.id)} as a manager. The event role was not found!`);
		} else {
			await member?.removeRole(role.id, `Left Code Jam`).catch(() => {});
			changes.push(`Removed ${utils.userMention(manageRemoveManager.id)} as a manager`);
		}
	}

	if (manageEventStart) {
		let format = utils.convertDateStringToDiscordTimeStamp(manageEventStart, 'd');

		await instance.collections.controllers.jam.updateCodeJamStartDate(interaction.guild!.id, format);

		changes.push(`Updated the event start date to ${format}`);
	}

	if (manageEventEnd) {
		let format = utils.convertDateStringToDiscordTimeStamp(manageEventEnd, 'd');

		await instance.collections.controllers.jam.updateCodeJamEndDate(interaction.guild!.id, format);

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

	return await interaction.createFollowup({
		embeds: [
			{
				description: instance.utils.stripIndents(
					`
\`\`\`asciidoc
• Success :: Successfully updated the Code Jam!
\`\`\`
**Changes:**
${instance.utils.codeBlock(changes.map((change, index) => `${index + 1}. ${change}`).join('\n'))}
`
				),
				color: constants.numbers.colors.secondary,
				timestamp: new Date().toISOString()
			}
		],
		flags: MessageFlags.EPHEMERAL
	});
}