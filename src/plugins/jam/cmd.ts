import { ApplicationCommandOptionTypes, ApplicationCommandTypes, GuildScheduledEventEntityTypes, GuildScheduledEventPrivacyLevels, MessageFlags } from 'oceanic.js';
import { CreateCommand } from '../../command.js';
import { isCanary } from '../../config/config.js';
import constants from '../../constants.js';

export default CreateCommand({
	trigger: 'jam',
	description: `Manage Code Jams`,
	type: ApplicationCommandTypes.CHAT_INPUT,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_EVENTS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	options: (opt) => {
		opt.addOption('jam-1', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option
				.setName('create')
				.setDescription('Create a Code Jam')
				.addOption('name', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('create-name').setDescription('The name of the Code Jam').setRequired(true);
				})
				.addOption('description', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('create-description').setDescription('The description of the Code Jam').setRequired(true);
				})
				.addOption('event role', ApplicationCommandOptionTypes.ROLE, (option) => {
					option.setName('create-event-role').setDescription('The event role of the Code Jam').setRequired(true);
				})
				.addOption('event type', ApplicationCommandOptionTypes.STRING, (option) => {
					option
						.setName('create-event-type')
						.setDescription('The type of the Code Jam')
						.addChoice('stage', 'STAGE_INSTANCE')
						.addChoice('voice', 'VOICE')
						.addChoice('external', 'EXTERNAL')
						.setRequired(true);
				})
				.addOption('event channel', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('create-event-channel').setDescription('The channel of the Code Jam').setRequired(true);
				})
				.addOption('event start', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('create-event-start').setDescription('The start date of the Code Jam').setRequired(true);
				})
				.addOption('event end', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('create-event-end').setDescription('The end date of the Code Jam').setRequired(true);
				})
				.addOption('event image', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('create-event-image').setDescription('The image of the Code Jam');
				});
		});
		opt.addOption('jam-2', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option
				.setName('delete')
				.setDescription('Delete a Code Jam')
				.addOption('name', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('delete-name').setDescription('The name of the Code Jam').setRequired(true);
				});
		});
		opt.addOption('jam-3', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option
				.setName('manage')
				.setDescription('Manage the current code jam')
				.addOption('update name', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('manage-name').setDescription('Update the name of the Code Jam');
				})
				.addOption('update description', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('manage-description').setDescription('Update the description of the Code Jam');
				})
				.addOption('update event role', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('manage-event-role').setDescription('Update the event role of the Code Jam');
				})
				.addOption('add manager', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('manage-add-manager').setDescription('Add a manager to the Code Jam');
				})
				.addOption('remove manager', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('manage-remove-manager').setDescription('Remove a manager from the Code Jam');
				})
				.addOption('add participant', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('manage-add-participant').setDescription('Add a participant to the Code Jam');
				})
				.addOption('remove participant', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('manage-remove-participant').setDescription('Remove a participant from the Code Jam');
				});
		});
		opt.addOption('jam-4', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option.setName('join').setDescription('Join a Code Jam');
		});
		opt.addOption('jam-5', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option.setName('leave').setDescription('Leave a Code Jam');
		});
		opt.addOption('jam-6', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option.setName('info').setDescription('Current Code Jam Info');
		});
	},
	register: isCanary ? 'guild' : 'global',
	run: async (instance, interaction) => {
		const subcommand = interaction.data.options.getSubCommand();

		await interaction.defer();

		if (subcommand?.find((name) => name === 'create')) {
			// Check if the user has the MANAGE_GUILD permission
			if (!interaction.member?.permissions.has('MANAGE_GUILD')) {
				return interaction.createFollowup({
					content: 'You do not have the `MANAGE_GUILD` permission to create a Code Jam!',
                    flags: MessageFlags.EPHEMERAL
				});
			}

			const createName = interaction.data.options.getString('create-name', true);
			const createDescription = interaction.data.options.getString('create-description', true);
			const createEventRole = interaction.data.options.getRole('create-event-role');
			const createEventType = interaction.data.options.getString('create-event-type', true);
			const createEventChannel = interaction.data.options.getChannel('create-event-channel', true);
			const createEventImage = interaction.data.options.getString('create-event-image');
			const createEventStart = interaction.data.options.getString('create-event-start', true);
			const createEventEnd = interaction.data.options.getString('create-event-end', true);

			// Check if the Code Jam already exists
			if (await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id)) {
				return interaction.createFollowup({
					content: 'A Code Jam already exists!',
					flags: MessageFlags.EPHEMERAL
				});
			}

			// Create the Code Jam
			await instance.collections.commands.plugins.jam.createCodeJam({
				guildId: interaction.guild!.id,
				name: createName,
				description: createDescription,
				roleId: createEventRole?.id,
				image: createEventImage,
				start: createEventStart,
				end: createEventEnd,
				entity: createEventType,
				channel: createEventChannel?.id,
				createdBy: interaction.member.username,
				createdById: interaction.member.user.id
			});

			const entityOption =
				createEventType === 'external'
					? GuildScheduledEventEntityTypes.EXTERNAL
					: createEventType === 'stage'
					? GuildScheduledEventEntityTypes.STAGE_INSTANCE
					: GuildScheduledEventEntityTypes.VOICE;

			await interaction.guild
				?.createScheduledEvent({
					name: createName,
					description: createDescription,
					channelID: createEventChannel?.id,
					reason: 'New Code Jam',
					image: createEventImage,
					scheduledStartTime: createEventStart,
					scheduledEndTime: createEventEnd,
					privacyLevel: GuildScheduledEventPrivacyLevels.GUILD_ONLY,
					entityType: entityOption
				})
				.then((event) => {
					interaction.createFollowup({
						content: 'Successfully created the Code Jam! You can now manage it with `/jam manage`!',
						embeds: [
							{
                                title: `${event.name}`,
								description: `${event.description}`,
								color: constants.numbers.colors.secondary
							}
						],
						flags: MessageFlags.EPHEMERAL
					});
				})
				.catch((err) => {
					interaction.createFollowup({
						content: `Error creating the Code Jam Event in the server!`,
						flags: MessageFlags.EPHEMERAL
					});
				});
		} else if (subcommand?.find((name) => name === 'delete')) {
			await interaction.createFollowup({ content: `Coming soon...` });
		} else if (subcommand?.find((name) => name === 'manage')) {
			await interaction.createFollowup({ content: `Coming soon...` });
		} else if (subcommand?.find((name) => name === 'join')) {
			await interaction.createFollowup({ content: `Coming soon...` });
		} else if (subcommand?.find((name) => name === 'leave')) {
			await interaction.createFollowup({ content: `Coming soon...` });
		} else if (subcommand?.find((name) => name === 'info')) {
			await interaction.createFollowup({ content: `Coming soon...` });
		}
	}
});
