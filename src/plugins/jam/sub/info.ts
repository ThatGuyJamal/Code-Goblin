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
		.setTimestamp(new Date().toISOString());

	if (jam.event_image_url) embed.setImage(jam.event_image_url);

	embed.addField('Created by ', `<@${jam.created_by_id}> | ${jam.created_at.toDateString()}`);

	if (jam.event_channel) {
		embed.addField('Event Channel', `<#${jam.event_channel}>`);
	}

	embed.addField('Event Role', `<@&${jam.event_role_id}>`);

	const participants = await instance.collections.commands.plugins.jam.getJamParticipants(interaction.guild!.id);
	const managers = await instance.collections.commands.plugins.jam.getJamManagers(interaction.guild!.id);

	if (participants && participants.length > 0) {
		// Only give the first 15 participants and number them 1 - 15
		const participantsString = participants
			.slice(0, 15)
			.map((id, index) => `${index + 1}. <@${id}>`)
			.join('\n');

		if (participants.length > 15) {
			embed.addField('Participants', `${participantsString} and ${participants.length - 15} more...`);
		} else {
			embed.addField('Participants', `${participantsString}`);
		}
	}

	if (managers && managers.length > 0) {
		// Only give the first 5 managers
		const managersString = managers
			.slice(0, 5)
			.map((id, index) => `${index + 1}. <@${id}>`)
			.join('\n');

		embed.addField('Managers', `${managersString}`);
	}

	await interaction.createFollowup({ embeds: [embed.toJSON()] });
}
