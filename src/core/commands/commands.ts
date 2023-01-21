import { ApplicationCommandTypes, ComponentTypes, ButtonStyles } from 'oceanic.js';
import config, { isCanary } from '../../config/config.js';
import { constants } from '../../utils/index.js';
import { CreateCommand } from '../structures/command.js';

export default CreateCommand({
	trigger: 'commands',
	description: 'View command information',
	type: ApplicationCommandTypes.CHAT_INPUT,
	register: isCanary ? 'guild' : 'global',
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	run: async (instance, interaction) => {
		const filteredCmdProps = instance.collections.commands.commandStoreMap.map((command) => {
			return {
				name: command.trigger,
				description: command.description,
				options: command.options
			};
		}).map((command) => command.name).join(', ');

		await interaction.createMessage({
			embeds: [
				{
					title: 'Commands',
					description: `${instance.utils.codeBlock(filteredCmdProps)}`,
					color: constants.numbers.colors.primary,
					timestamp: new Date().toISOString(),
					thumbnail: {
						url: interaction.guild?.iconURL('png') ?? interaction.user.avatarURL('png')
					},
					footer: {
						text: `Requested by ${interaction.user.tag}`
					}
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
							url: config.BotClientOAuth2Url
						},
						{
							type: ComponentTypes.BUTTON,
							style: ButtonStyles.LINK,
							label: 'Support Server',
							url: config.DevelopmentServerInviteUrl
						}
					]
				}
			]
		});
	}
});
