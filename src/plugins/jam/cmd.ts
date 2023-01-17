import { EmbedBuilder } from '@oceanicjs/builders';
import {
	ApplicationCommandOptionTypes,
	ApplicationCommandTypes,
	ChannelTypes,
	// GuildScheduledEventEntityTypes,
	// GuildScheduledEventPrivacyLevels,
	MessageFlags
} from 'oceanic.js';
import { CreateCommand } from '../../command.js';
import { isCanary } from '../../config/config.js';
import constants from '../../constants.js';
import { logger } from '../../index.js';

export default CreateCommand({
	trigger: 'jam',
	description: `Manage Code Jams`,
	type: ApplicationCommandTypes.CHAT_INPUT,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_EVENTS', 'MANAGE_ROLES'],
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
				// .addOption('event type', ApplicationCommandOptionTypes.STRING, (option) => {
				// 	option
				// 		.setName('create-event-type')
				// 		.setDescription('The type of the Code Jam')
				// 		.addChoice('stage', 'STAGE_INSTANCE')
				// 		.addChoice('voice', 'VOICE')
				// 		.addChoice('external', 'EXTERNAL')
				// 		.setRequired(true);
				// })
				.addOption('event channel', ApplicationCommandOptionTypes.CHANNEL, (option) => {
					option
						.setName('create-event-channel')
						.setDescription('The channel of the Code Jam')
						.setChannelTypes([ChannelTypes.GUILD_VOICE, ChannelTypes.GUILD_STAGE_VOICE, ChannelTypes.GUILD_TEXT])
						.setRequired(true);
				})
				// .addOption('event start', ApplicationCommandOptionTypes.STRING, (option) => {
				// 	option.setName('create-event-start').setDescription('The start date of the Code Jam').setRequired(true);
				// })
				// .addOption('event end', ApplicationCommandOptionTypes.STRING, (option) => {
				// 	option.setName('create-event-end').setDescription('The end date of the Code Jam').setRequired(true);
				// })
				.addOption('event image', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('create-event-image').setDescription('The image of the Code Jam');
				});
		});
		opt.addOption('jam-2', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option.setName('delete').setDescription('Delete the current Code Jam');
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
				.addOption('update event role', ApplicationCommandOptionTypes.ROLE, (option) => {
					option.setName('manage-event-role').setDescription('Update the event role of the Code Jam');
				})
				.addOption('add manager', ApplicationCommandOptionTypes.USER, (option) => {
					option.setName('manage-add-manager').setDescription('Add a manager to the Code Jam');
				})
				.addOption('remove manager', ApplicationCommandOptionTypes.USER, (option) => {
					option.setName('manage-remove-manager').setDescription('Remove a manager from the Code Jam');
				})
				.addOption('add participant', ApplicationCommandOptionTypes.USER, (option) => {
					option.setName('manage-add-participant').setDescription('Add a participant to the Code Jam');
				})
				.addOption('remove participant', ApplicationCommandOptionTypes.USER, (option) => {
					option.setName('manage-remove-participant').setDescription('Remove a participant from the Code Jam');
				})
				.addOption('update event image', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('manage-event-image').setDescription('Update the image of the Code Jam');
				})
				.addOption('update event channel', ApplicationCommandOptionTypes.CHANNEL, (option) => {
					option
						.setName('manage-event-channel')
						.setDescription('Update the channel of the Code Jam')
						.setChannelTypes([ChannelTypes.GUILD_VOICE, ChannelTypes.GUILD_STAGE_VOICE]);
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
			// const createEventType = interaction.data.options.getString('create-event-type', true);
			const createEventChannel = interaction.data.options.getChannel('create-event-channel', true);
			// const createEventStart = interaction.data.options.getString('create-event-start', true);
			// const createEventEnd = interaction.data.options.getString('create-event-end', true);
			const createEventRole = interaction.data.options.getRole('create-event-role', true);

			const createEventImage = interaction.data.options.getString('create-event-image');

			// Check if the Code Jam already exists
			if (await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id)) {
				return interaction.createFollowup({
					content: 'A Code Jam already exists in this server!',
					flags: MessageFlags.EPHEMERAL
				});
			}

			try {
				// Create the Code Jam
				await instance.collections.commands.plugins.jam.createCodeJam({
					guildId: interaction.guild!.id,
					jam_name: createName,
					jam_description: createDescription,
					roleId: createEventRole?.id,
					image: createEventImage,
					// start: createEventStart,
					// end: createEventEnd,
					// entity: createEventType,
					channel: createEventChannel?.id,
					createdBy: interaction.member.username,
					createdById: interaction.member.user.id
				});

				// const entityOption =
				// 	createEventType === 'external'
				// 		? GuildScheduledEventEntityTypes.EXTERNAL
				// 		: createEventType === 'stage'
				// 		? GuildScheduledEventEntityTypes.STAGE_INSTANCE
				// 		: GuildScheduledEventEntityTypes.VOICE;

				// await interaction.guild?.createScheduledEvent({
				// 	name: createName,
				// 	description: createDescription,
				// 	channelID: createEventChannel?.id,
				// 	reason: 'New Code Jam',
				// 	image: createEventImage,
				// 	scheduledStartTime: createEventStart,
				// 	scheduledEndTime: createEventEnd,
				// 	privacyLevel: GuildScheduledEventPrivacyLevels.GUILD_ONLY,
				// 	entityType: entityOption
				// });

				await interaction.createFollowup({
					content: `Successfully created a new Code Jam! You can now manage __**${createName}**__ with the \`/jam manage\` command!`,
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

		if (subcommand?.find((name) => name === 'delete')) {
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
		if (subcommand?.find((name) => name === 'manage')) {
			const jam = await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id);

			if (!jam) return await interaction.createFollowup({ content: `No current Code Jam found in __${interaction.guild!.name}__` });

			// Check
			if (!interaction.member?.permissions.has('MANAGE_GUILD') || jam.created_by_id !== interaction.member.user.id) {
				return await interaction.createFollowup({
					content: `You are not the creator of this Code Jam or you do not have the \`MANAGE_GUILD\` permission!\n\nThis Code Jam was not deleted.`,
					flags: MessageFlags.EPHEMERAL
				});
			}

			const manageName = interaction.data.options.getString('manage-name');
			const manageDescription = interaction.data.options.getString('manage-description');
			const manageEventType = interaction.data.options.getString('manage-event-type');
			const manageEventChannel = interaction.data.options.getChannel('manage-event-channel');
			const manageEventRole = interaction.data.options.getRole('manage-event-role');
			const manageEventImage = interaction.data.options.getString('manage-event-image');

			const manageAddParticipant = interaction.data.options.getUser('manage-add-participant');
			const manageRemoveParticipant = interaction.data.options.getUser('manage-remove-participant');

			const manageAddManager = interaction.data.options.getUser('manage-add-manager');
			const manageRemoveManager = interaction.data.options.getUser('manage-remove-manager');

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
				!manageRemoveManager
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

				changes.push(`Added <@${manageAddParticipant.id}> as a participant`);
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

			if (manageEventImage) {
				await instance.collections.commands.plugins.jam.updateCodeJamImage(interaction.guild!.id, manageEventImage);

				changes.push(`Updated the event image to \`${manageEventImage}\``);
			}

			if (manageRemoveParticipant) {
				await instance.collections.commands.plugins.jam.removeJamParticipant(interaction.guild!.id, manageRemoveParticipant.id);

				changes.push(`Removed <@${manageRemoveParticipant.id}> as a participant`);
			}

			if (manageAddManager) {
				await instance.collections.commands.plugins.jam.addJamManager(interaction.guild!.id, manageAddManager.id);

				changes.push(`Added <@${manageAddManager.id}> as a manager`);
			}

			if (manageRemoveManager) {
				await instance.collections.commands.plugins.jam.removeJamManager(interaction.guild!.id, manageRemoveManager.id);

				changes.push(`Removed <@${manageRemoveManager.id}> as a manager`);
			}

			await interaction.createFollowup({
				content: `Successfully updated the Code Jam!\n\n**Changes:**\n${changes
					.map((change, index) => `${index + 1}. ${change}`)
					.join('\n')}`,
				flags: MessageFlags.EPHEMERAL,
				allowedMentions: {
					users: false,
					roles: false,
					repliedUser: true
				}
			});
		}
		if (subcommand?.find((name) => name === 'join')) {
			const jam = await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id);

			if (jam?.event_participants_ids?.includes(interaction.member!.id))
				return await interaction.createFollowup({ content: `You are already in this Code Jam!` });

			if (!jam) return await interaction.createFollowup({ content: `You can only join a Jam during an active event.` });

			const role = interaction.guild?.roles.get(jam.event_role_id!);

			if (!role) return await interaction.createFollowup({ content: `The role for this Code Jam does not exist! We cant add you...` });

			await interaction.member?.addRole(role.id, `Joined Code Jam`).catch(() => {});

			await instance.collections.commands.plugins.jam.addJamParticipant(interaction.guild!.id, interaction.member!.id);

			await interaction.createFollowup({ content: `You have successfully joined the Code Jam!` });
		}
		if (subcommand?.find((name) => name === 'leave')) {
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
		if (subcommand?.find((name) => name === 'info')) {
			const jam = await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id);

			if (!jam) return await interaction.createFollowup({ content: `No current Code Jam found in __${interaction.guild!.name}__` });

			const embed = new EmbedBuilder()
				.setTitle(`${jam.name} Code Jam`)
				.setDescription(jam.description)
				.setColor(constants.numbers.colors.secondary)
				.setTimestamp(new Date().toISOString());

			if (jam.event_image_url) embed.setImage(jam.event_image_url);

			embed.addField('Created by ', `<@${jam.created_by_id}> | ${jam.created_at.toDateString()}`);

			if (jam.event_channel) {
				embed.addField('Event Channel', `<#${jam.event_channel}>`);
			}

			embed.addField('Event Role', `<@&${jam.event_role_id}>`);

			const participants = await instance.collections.commands.plugins.jam.getJamParticipants(interaction.guild!.id);
			const managers = await instance.collections.commands.plugins.jam.getJamManagers(interaction.guild!.id);

			if (participants && participants.length > 0) {
				// Only give the first 15 participants and number them 1 - 15
				const participantsString = participants
					.slice(0, 15)
					.map((id, index) => `${index + 1}. <@${id}>`)
					.join('\n');

				if (participants.length > 15) {
					embed.addField('Participants', `${participantsString} and ${participants.length - 15} more...`);
				} else {
					embed.addField('Participants', `${participantsString}`);
				}
			}

			if (managers && managers.length > 0) {
				// Only give the first 5 managers
				const managersString = managers
					.slice(0, 5)
					.map((id, index) => `${index + 1}. <@${id}>`)
					.join('\n');

				embed.addField('Managers', `${managersString}`);
			}

			await interaction.createFollowup({ embeds: [embed.toJSON()] });
		}
	}
});
