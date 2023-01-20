import config from '../../config/config.js';
import { logger } from '../../utils/index.js';
import { Main } from '../index.js';
import { CreateGlobalCommands, CreateGuildCommands, deleteGlobalCommands, deleteGuildCommands } from '../structures/command.js';

export default async function () {
	await Main.DiscordClient.loadCommands();

	if (config.register_commands.delete.guild) await deleteGuildCommands(Main.DiscordClient);
	if (config.register_commands.delete.global) await deleteGlobalCommands(Main.DiscordClient);

	if (config.register_commands.create.guild) await CreateGuildCommands(Main.DiscordClient);
	if (config.register_commands.create.global) await CreateGlobalCommands(Main.DiscordClient);

	logger.info(`Ready As ${Main.DiscordClient.user.tag} (${Main.DiscordClient.user.id})`);

	await Main.utils.sendToLogChannel('api', `Ready as ${Main.DiscordClient.user.tag} (${Main.DiscordClient.user.id})`);
}
