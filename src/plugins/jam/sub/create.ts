import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags } from 'oceanic.js';
import { logger } from '../../../index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	// Check if the user has the MANAGE_GUILD permission
	if (!interaction.member?.permissions.has('MANAGE_GUILD')) {
		return interaction.createFollowup({
			content: 'You do not have the `MANAGE_GUILD` permission to create a Code Jam!',
			flags: MessageFlags.EPHEMERAL
		});
	}

	const createName = interaction.data.options.getString('create-name', true);
	const createDescription = interaction.data.options.getString('create-description', true);
	// const createEventType = interaction.data.options.getString('create-event-type', true);
	const createEventChannel = interaction.data.options.getChannel('create-event-channel', true);
	let createEventStart = interaction.data.options.getString('create-event-start', true);
	let createEventEnd = interaction.data.options.getString('create-event-end', true);
	const createEventRole = interaction.data.options.getRole('create-event-role', true);
	const createEventManagerRole = interaction.data.options.getRole('create-event-manager-role', true);

	const createEventImage = interaction.data.options.getString('create-event-image');

	// Check if the Code Jam already exists
	if (await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id)) {
		return interaction.createFollowup({
			content: 'A Code Jam already exists in this server!',
			flags: MessageFlags.EPHEMERAL
		});
	}

	try {
		createEventStart = instance.utils.convertDateStringToDiscordTimeStamp(createEventStart, 'd');
		createEventEnd = instance.utils.convertDateStringToDiscordTimeStamp(createEventEnd, 'd');

		// Create the Code Jam
		await instance.collections.commands.plugins.jam.createCodeJam({
			guildId: interaction.guild!.id,
			jam_name: createName,
			jam_description: createDescription,
			roleId: createEventRole?.id,
			roleIdManagers: createEventManagerRole?.id,
			image: createEventImage,
			start: createEventStart,
			end: createEventEnd,
			channel: createEventChannel?.id,
			createdBy: interaction.member.username,
			createdById: interaction.member.user.id
		});

		await interaction.createFollowup({
			content: `Successfully created a new Code Jam!\nAs its creator you can manage the Code Jam with the \`/jam manage\` command.\nAdd more managers and participants.`,
			flags: MessageFlags.EPHEMERAL
		});
	} catch (err) {
		await interaction.createFollowup({
			content: `Error creating the Code Jam Event in the server!`,
			flags: MessageFlags.EPHEMERAL
		});
		logger.error(err);
		console.error(err);
	}
}
