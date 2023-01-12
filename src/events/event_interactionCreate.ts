import { AnyInteractionGateway, InteractionTypes } from 'oceanic.js';
import config from '../config/config.js';
import { GlobalStatsModel } from '../database/schemas/statistics.js';
import type { MainInstance } from '../main.js';

export default async function (this: typeof MainInstance, interaction: AnyInteractionGateway) {
	if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
		try {
			if (config.IsInDevelopmentMode) {
				console.log(`[${new Date().toISOString()}][command/${interaction.data.name}]: ${interaction.user.tag} (${interaction.user.id})`);
			}
			await GlobalStatsModel.findOneAndUpdate(
				{ find_id: 'global' },
				{ $inc: { commands_executed: 1 } },
				{
					upsert: true,
					new: true
				}
			);
			await this.processCommandInteraction(interaction);
		} catch (error) {
			console.error(error);
			await interaction
				.createMessage({
					content: `An error occurred while running \`/${interaction.data.name}\` command.`
				})
				.catch(() => {});

			await GlobalStatsModel.findOneAndUpdate(
				{ find_id: 'global' },
				{ $inc: { commands_failed: 1 } },
				{
					new: true,
					upsert: true
				}
			);
		}
	}

	if (interaction.type === InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE) {
		console.log(`[${new Date().toISOString()}][autocomplete/${interaction.data.name}]: ${interaction.user.tag} (${interaction.user.id})`);
		switch (interaction.data.name) {
		}
	}
}
