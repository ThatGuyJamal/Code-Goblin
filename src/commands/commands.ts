import { ApplicationCommandTypes, ButtonStyles, ComponentTypes } from 'oceanic.js';
import { CreateCommand } from '../command.js';
import config from '../config/config.js';

export default CreateCommand({
	trigger: 'commands',
	description: 'Helpful bot information on the modules and functions.',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: {
		guild: true,
		global: false
	},
	run: async (instance, interaction) => {
		const commands = instance.collections.commands.commandStoreMap.map((command) => {
			return {
				name: command.trigger,
				description: command.description
			};
		});

		await interaction.createMessage({
			embeds: [
				{
					title: 'All Modules',
					description: `${commands.map((cmd) => `\`/${cmd.name}\``).join(', ')}`
				}
			],
			components: [
				{
					type: ComponentTypes.ACTION_ROW,
					components: [
						{
							type: ComponentTypes.BUTTON,
							style: ButtonStyles.LINK,
							label: 'Invite Me',
							url: config.DevelopmentServerInviteUrl
						},
						{
							type: ComponentTypes.BUTTON,
							style: ButtonStyles.LINK,
							label: 'Whisper Room',
							url: config.whisper_room.url
						}
					]
				}
			]
		});
	}
});
