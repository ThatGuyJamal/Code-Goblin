import { CommandInteraction, AnyTextChannelWithoutGroup, Uncached, MessageFlags } from 'oceanic.js';
import { constants, logger } from '../../../../utils/index.js';
import type Main from '../../../main.js';

export default async function (instance: Main, interaction: CommandInteraction<AnyTextChannelWithoutGroup | Uncached>) {
	await interaction.defer();

	await interaction.createFollowup({
		content: `Ending the Code Jam...`
	});

	try {
		const jam = await instance.collections.controllers.jam.getCodeJam(interaction.guild!.id);

		if (!jam) {
			return await interaction.createFollowup({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
\`\`\`asciidoc
• Error :: No current Code Jam found in ${interaction.guild!.name}
\`\`\`
`
						),
						color: constants.numbers.colors.secondary,
						timestamp: new Date().toISOString()
					}
				],
				flags: MessageFlags.EPHEMERAL
			});
		}

		if (!interaction.member?.permissions.has('MANAGE_GUILD') || jam.event_managers_ids?.includes(interaction.member!.id)) {
			return await interaction.createFollowup({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
\`\`\`asciidoc
• Error :: You do not have the MANAGE_GUILD permission!
\`\`\`
`
						),
						color: constants.numbers.colors.secondary,
						timestamp: new Date().toISOString()
					}
				],
				flags: MessageFlags.EPHEMERAL
			});
		}

		let participants = jam.event_participants_ids ?? [];
		let managers = jam.event_managers_ids ?? [];
		let pRole = interaction.guild!.roles.get(jam.event_role_id!);
		let mRole = interaction.guild!.roles.get(jam.event_managers_role_id!);

		if ((!pRole && !mRole) || !pRole || !mRole) {
			return await interaction.createFollowup({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
\`\`\`asciidoc
• Error :: The event role and event managers role is not set! Please check the data with <jam manage> command
\`\`\`
`
						),
						color: constants.numbers.colors.secondary,
						timestamp: new Date().toISOString()
					}
				],
				flags: MessageFlags.EPHEMERAL
			});
		}

		await interaction.editOriginal({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Success :: Removing all participants from the event...
\`\`\`
`
					),
					color: constants.numbers.colors.secondary,
					timestamp: new Date().toISOString()
				}
			]
		});

		if (!jam.event_role_id) {
			return await interaction.createFollowup({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
\`\`\`asciidoc
• Error :: The event role ID is not set!
\`\`\`
`
						),
						color: constants.numbers.colors.secondary,
						timestamp: new Date().toISOString()
					}
				],
				flags: MessageFlags.EPHEMERAL
			});
		}

		if (!jam.event_managers_role_id) {
			return await interaction.createFollowup({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
\`\`\`asciidoc
• Error :: The event managers role ID is not set!
\`\`\`
`
						),
						color: constants.numbers.colors.secondary,
						timestamp: new Date().toISOString()
					}
				],
				flags: MessageFlags.EPHEMERAL
			});
		}

		// Remove all participants from the event
		for (const participant of participants) {
			let member = interaction.guild!.members.get(participant);

			if (!member) continue;

			await member.removeRole(pRole.id, 'Code Jam ended!');
		}

		await interaction.editOriginal({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Success :: Removing all managers from the event...
\`\`\`
`
					),
					color: constants.numbers.colors.secondary,
					timestamp: new Date().toISOString()
				}
			]
		});

		// Remove all managers from the event
		for (const manager of managers) {
			let member = interaction.guild!.members.get(manager);

			if (!member) continue;

			await member.removeRole(mRole.id, 'Code Jam ended!');
		}

		await interaction.editOriginal({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Success :: Deleting Event Data...
\`\`\`
`
					),
					color: constants.numbers.colors.secondary,
					timestamp: new Date().toISOString()
				}
			]
		});

		await instance.collections.controllers.jam.deleteCodeJam(interaction.guild!.id);

		return await interaction.editOriginal({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Success :: Code Jam ended!
\`\`\`
`
					),
					color: constants.numbers.colors.secondary,
					timestamp: new Date().toISOString()
				}
			]
		});
	} catch (error) {
		logger.error(error);
		await interaction.editOriginal({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
\`\`\`asciidoc
• Error :: An error occurred while ending the code jam!
\`\`\`
`
					),
					color: constants.numbers.colors.secondary,
					timestamp: new Date().toISOString()
				}
			]
		});
	}
}
