import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	const channel = interaction.data.options.getChannel('channel', true);
	const context = interaction.data.options.getString('context', true);

	await instance.collections.commands.plugins.welcome.CreateWelcome(interaction.guild!.id, channel.id, 'text', context, true);

	return await interaction.createFollowup({
		content: 'Welcome Plugin Configured!'
	});
}
