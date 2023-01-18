import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	const jam = await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id);

	if (!jam) return await interaction.createFollowup({ content: `No current Code Jam found in __${interaction.guild!.name}__` });

	await interaction.createFollowup({
		content: `Ending the Code Jam...`
	});

	await instance.collections.commands.plugins.jam.endCodeJam(interaction.guild!.id);

	return await interaction.createFollowup({
		content: `Code Jam ended!`
	});
}
