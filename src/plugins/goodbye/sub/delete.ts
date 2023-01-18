import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	await instance.collections.commands.plugins.goodbye.DeleteGoodbye(interaction.guild!.id);
	return await interaction.createFollowup({
		content: 'Goodbye Plugin Config Deleted!'
	});
}
