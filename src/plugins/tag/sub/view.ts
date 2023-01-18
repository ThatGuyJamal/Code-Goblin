import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();
	const name = interaction.data.options.getString('name', true);
	const mention = interaction.data.options.getUser('mention', false);
	const tag = await instance.collections.commands.plugins.tags.GetTag(interaction.guild!.id, name);

	return await interaction.createFollowup({
		content: tag
			? `${mention ? `__*<@${mention.id}> was mentioned in this tag...*__` : ''}\n\n${instance.utils.FormatPluginStringData(
					interaction.member!,
					tag.content
			  )}`
			: `Tag \`${name}\` doesn't exist for this server!`,
		allowedMentions: {
			users: mention ? [mention.id] : []
		}
	});
}
