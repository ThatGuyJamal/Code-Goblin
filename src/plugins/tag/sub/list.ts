import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags } from 'oceanic.js';
import constants from '../../../constants.js';
import { logger } from '../../../index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();
	const tags = await instance.collections.commands.plugins.tags.GetTags(interaction.guild!.id);

	const noTags = tags.length === 0;

	return await interaction
		.createFollowup({
			embeds: [
				{
					title: 'Tags',
					description: noTags ? 'No tags to list in this server' : tags.map((tag) => `\`${tag.name}\``).join('\n '),
					color: constants.numbers.colors.secondary,
					footer: {
						text: noTags ? '' : `Use /tag view <name> to view a tag`
					}
				}
			]
		})
		.catch((err) => {
			logger.error(err);
			instance.utils.sendToLogChannel('error', {
				embeds: [
					{
						title: 'Tag List Command Error',
						description: `Error sending tag list to ${interaction.user.tag} (${interaction.user.id}) in ${interaction.guild!.name} (${
							interaction.guild!.id
						})`,
						color: 0xff0000,
						fields: [
							{
								name: 'Error',
								value: `\`\`\`${err}\`\`\``
							}
						]
					}
				],
				flags: MessageFlags.EPHEMERAL
			});
		});
}
