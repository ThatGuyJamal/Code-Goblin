import { EmbedBuilder } from '@oceanicjs/builders';
import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import constants from '../../../constants.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	const jam = await instance.collections.commands.plugins.jam.getCodeJam(interaction.guild!.id);

	if (!jam) return await interaction.createFollowup({ content: `No current Code Jam found in __${interaction.guild!.name}__` });

	const embed = new EmbedBuilder()
		.setTitle(`${jam.name} Code Jam`)
		.setDescription(jam.description)
		.setColor(constants.numbers.colors.secondary)
		.setTimestamp(new Date().toISOString())
		.setThumbnail(interaction.guild?.iconURL('png') ?? instance.DiscordClient.user.avatarURL("png"));

	if (jam.event_image_url) embed.setImage(jam.event_image_url);

	embed.addField('Created by ', `${instance.utils.userMention(jam.created_by_id)} | ${jam.created_at.toDateString()}`);

	embed.addField('Start Time', `${jam.event_scheduled_start_time}`, true);
	embed.addField('End Time', `${jam.event_scheduled_end_time}`, true);

	embed.addField('Event Role', `${instance.utils.roleMention(jam.event_role_id!)}`, true);
	embed.addField('Event Manager Role', `${instance.utils.roleMention(jam.event_managers_role_id!)}`, true);

	if (jam.event_channel) {
		embed.addField('Event Channel', `${instance.utils.channelMention(jam.event_channel)}`, true);
	}

	const managers = await instance.collections.commands.plugins.jam.getJamManagers(interaction.guild!.id);

	if (managers && managers.length > 0) {
		// Only give the first 5 managers
		const managersString = managers
			.slice(0, 5)
			.map((id, index) => `${index + 1}. ${instance.utils.userMention(id)}`)
			.join('\n');

		embed.addField('Managers', `${managersString}`);
	}

	const participants = await instance.collections.commands.plugins.jam.getJamParticipants(interaction.guild!.id);

	if (participants && participants.length > 0) {
		// Only give the first 15 participants and number them 1 - 15
		const participantsString = participants
			.slice(0, 15)
			.map((id, index) => `${index + 1}. ${instance.utils.userMention(id)}`)
			.join('\n');

		if (participants.length > 15) {
			embed.addField('Participants', `${participantsString} and ${participants.length - 15} more...`);
		} else {
			embed.addField('Participants', `${participantsString}`);
		}
	}

	await interaction.createFollowup({ embeds: [embed.toJSON()] });
}
