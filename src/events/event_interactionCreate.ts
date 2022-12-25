import { AnyInteractionGateway, InteractionTypes } from 'oceanic.js';
import config from '../config/config.js';
import type { MainInstance } from '../main.js';

export default async function (this: typeof MainInstance, interaction: AnyInteractionGateway) {
	if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
		try {
			if (config.IsInDevelopmentMode) {
				console.log(`[${new Date().toISOString()}][command/${interaction.data.name}]: ${interaction.user.tag} (${interaction.user.id})`);
			}
			await this.processCommandInteraction(interaction).catch((err) => {
				console.error(`[ERROR] Error while processing command interaction:`, err);
				interaction.createMessage({ content: 'An error occurred while processing your command.', flags: 64 });
			});
		} catch (error) {
			console.error(error);
			await interaction
				.createMessage({
					content: `An error occurred while running \`/${interaction.data.name}\` command.`
				})
				.catch(() => {});
		}
	}
}
