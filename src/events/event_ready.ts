import type { Client } from 'oceanic.js';
import { deleteGuildCommands, deleteGlobalCommands, CreateGuildCommands, CreateGlobalCommands } from '../command.js';
import config from '../config/config.js';
import { MainInstance } from '../main.js';

export default async function (client: Client) {
	await MainInstance.loadCommands();

	if (config.register_commands.delete.guild) await deleteGuildCommands(client);
	if (config.register_commands.delete.global) await deleteGlobalCommands(client);

	if (config.register_commands.create.guild) await CreateGuildCommands(client);
	if (config.register_commands.create.global) await CreateGlobalCommands(client);

	console.log(`[EVENT] Ready As`, client.user.tag);

	await MainInstance.utils.sendToLogChannel('api', {
		content: `Ready as ${client.user.tag} (${client.user.id})`
	});
}
