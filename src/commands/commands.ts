import { ApplicationCommandTypes, ButtonStyles, ComponentTypes } from 'oceanic.js';
import { CreateCommand } from '../cmd/command.js';
import config, { isCanary } from '../config/config.js';
import constants from '../utils/constants.js';

export default CreateCommand({
	trigger: 'commands',
	description: 'Lists all commands',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: isCanary ? 'guild' : 'global',
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	run: async (instance, interaction) => {
		
		const filteredCmdProps = instance.collections.commands.commandStoreMap.map((command) => {
			return {
				name: command.trigger,
				description: command.description
			};
		});

		await interaction.createMessage({
			embeds: [
				{
					title: 'Commands',
					description: `${filteredCmdProps.map((cmd) => `\`/${cmd.name}\``).join(', ')}`,
					color: constants.numbers.colors.primary
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
