import { EmbedBuilder } from '@oceanicjs/builders';
import type { CommandInteraction, AnyTextChannelWithoutGroup, Uncached } from 'oceanic.js';
import { constants } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	const jam = await instance.collections.controllers.jam.getCodeJam(interaction.guild!.id);

	if (!jam) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: Code Jam has not been configured!
\`\`\`
`
					),
					color: constants.numbers.colors.secondary,
					timestamp: new Date().toISOString()
				}
			]
		});
	}

	const embed = new EmbedBuilder();

	const managers = await instance.collections.controllers.jam.getJamManagers(interaction.guild!.id);

	if (managers && managers.length > 0) {
		// Only give the first 5 managers
		const managersString = managers
			.slice(0, 5)
			.map((id, index) => `${index + 1}. ${instance.utils.userMention(id)}`)
			.join('\n');

		embed.addField('Managers', `${managersString}`);
	}

	const participants = await instance.collections.controllers.jam.getJamParticipants(interaction.guild!.id);

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

	await interaction.createFollowup({
		embeds: [
			{
				...embed.toJSON(),
				description: instance.utils.stripIndents(
					`
Configured Code Jam:
\`\`\`asciidoc
• Name               :: ${jam.name}
• Description        :: ${jam.description}
• Created At         :: ${jam.created_at.toDateString()} 
\`\`\`
> Created By         :: ${instance.utils.userMention(jam.created_by_id)}
> Start Time         :: ${jam.event_scheduled_start_time}
> End Time           :: ${jam.event_scheduled_end_time}
> Event Role         :: ${instance.utils.roleMention(jam.event_role_id!)}
> Event Manager Role :: ${instance.utils.roleMention(jam.event_managers_role_id!)}
> Event Channel      :: ${instance.utils.channelMention(jam.event_channel!)}
`
				),
				thumbnail: {
					url: interaction.guild?.iconURL('png') ?? instance.DiscordClient.user.avatarURL('png')
				},
				color: constants.numbers.colors.secondary,
				timestamp: new Date().toISOString()
			}
		]
	});
}
