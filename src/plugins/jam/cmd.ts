import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes } from 'oceanic.js';

import { CreateCommand } from '../../command.js';
import { isCanary } from '../../config/config.js';

import handleCreate from './sub/create.js';
import handleDelete from './sub/delete.js';
import handleInfo from './sub/info.js';
import handleJoin from './sub/join.js';
import handleLeave from './sub/leave.js';
import handleManage from './sub/manage.js';
import handleEnd from './sub/end.js';

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
				.addOption('event manager role', ApplicationCommandOptionTypes.ROLE, (option) => {
					option.setName('create-event-manager-role').setDescription('The manager role of the Code Jam').setRequired(true);
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
				.addOption('update event manager role', ApplicationCommandOptionTypes.ROLE, (option) => {
					option.setName('manage-event-manager-role').setDescription('Update the manager role of the Code Jam');
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
				})
				.addOption('update event start', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('manage-event-start').setDescription('Update the start date of the Code Jam');
				})
				.addOption('update event end', ApplicationCommandOptionTypes.STRING, (option) => {
					option.setName('manage-event-end').setDescription('Update the end date of the Code Jam');
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
		opt.addOption('jam-7', ApplicationCommandOptionTypes.SUB_COMMAND, (option) => {
			option.setName('end').setDescription('End Current Code Jam Info');
		});
	},
	register: isCanary ? 'guild' : 'global',
	run: async (instance, interaction) => {
		const subcommand = interaction.data.options.getSubCommand();

		if (subcommand?.find((name) => name === 'create')) return await handleCreate(instance, interaction);
		if (subcommand?.find((name) => name === 'delete')) return await handleDelete(instance, interaction);
		if (subcommand?.find((name) => name === 'manage')) return await handleManage(instance, interaction);
		if (subcommand?.find((name) => name === 'join')) return await handleJoin(instance, interaction);
		if (subcommand?.find((name) => name === 'leave')) return await handleLeave(instance, interaction);
		if (subcommand?.find((name) => name === 'info')) return await handleInfo(instance, interaction);
		if (subcommand?.find((name) => name === 'end')) return await handleEnd(instance, interaction);
	}
});
