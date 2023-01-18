import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import constants from '../../../constants.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
    await interaction.defer();

    const data = await instance.collections.commands.plugins.goodbye.GetGoodbye(interaction.guild!.id);

	if (!data)
		return await interaction.createFollowup({
			content: 'No data to view.'
		});

	return await interaction.createFollowup({
		embeds: [
			{
				title: 'Goodbye Plugin Current Config',
				description: data.content,
				fields: [
					{
						name: 'raw view',
						value: `\`\`\`${data.content}\`\`\``,
						inline: false
					}
				],
				color: constants.numbers.colors.secondary
			}
		]
	});
}
