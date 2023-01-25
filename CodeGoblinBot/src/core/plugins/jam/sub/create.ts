import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags } from 'oceanic.js';
import { constants, logger } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer(64);

	// Check if the user has the MANAGE_GUILD permission
	if (!interaction.member?.permissions.has('MANAGE_GUILD')) {
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
	if (await instance.database.schemas.jam.GetJam(interaction.guild!.id)) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: A current Code Jam already exists!
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

	try {
		createEventStart = instance.utils.convertDateStringToDiscordTimeStamp(createEventStart, 'd');
		createEventEnd = instance.utils.convertDateStringToDiscordTimeStamp(createEventEnd, 'd');

		// Create the Code Jam
		await instance.database.schemas.jam.CreateJam({
			guild_id: interaction.guild!.id,
			name: createName,
			description: createDescription,
			event_role_id: createEventRole?.id,
			event_participants_ids: [],
			event_managers_ids: [],
			event_managers_role_id: createEventManagerRole?.id,
			event_image_url: createEventImage,
			event_scheduled_start_time: createEventStart,
			event_scheduled_end_time: createEventEnd,
			event_channel: createEventChannel?.id,
			created_by_name: interaction.member.username,
			created_by_id: interaction.member.user.id
		});

		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Success :: Successfully created a new Code Jam!

• Name :: ${createName}
• Description :: ${createDescription}
\`\`\`
__What now?__
${instance.utils.codeBlock(
	'As its creator you can manage the Code Jam with the </jam manage> command. You can also add more managers and participants with the </jam add> command.'
)}
`
					),
					color: constants.numbers.colors.secondary,
					timestamp: new Date().toISOString()
				}
			],
			flags: MessageFlags.EPHEMERAL
		});
	} catch (err) {
		err
		await interaction.createFollowup({
			content: `Error creating the Code Jam Event in the server!\n\`\`\`${err}\`\`\``,
			flags: MessageFlags.EPHEMERAL
		});
		logger.error(err);
	}
}
