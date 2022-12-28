import { ApplicationCommandBuilder } from '@oceanicjs/builders';
import type { ApplicationCommandTypes, Client, CommandInteraction, CreateApplicationCommandOptions, Permission, PermissionName } from 'oceanic.js';
import config from '../config/config.js';
import { MainInstance } from '../main.js';
import type { CooldownDurations } from '../plugins/cooldown.js';

export interface CommandDataProp {
	props: Command;
	toJson: () => CreateApplicationCommandOptions;
}

export type CommandRegisterType = 'global' | 'guild' | 'both';

export interface CommandCooldown {
	/** The duration of the cooldown */
	duration: CooldownDurations;
	multiplier: number;
}

/**
 * The type structure for a command
 */
export interface Command {
	/** The name of the command interaction data */
	trigger: string;
	description: string;
	type: ApplicationCommandTypes;
	options?: (opts: ApplicationCommandBuilder) => void;
	run: (instance: typeof MainInstance, interaction: CommandInteraction) => Promise<any> | any;
	register?: CommandRegisterType;
	cooldown?: CommandCooldown;
	requiredUserPermissions?: PermissionName[];
	requiredBotPermissions?: PermissionName[];
	defaultMemberPermissions?: bigint | string | Permission | Array<PermissionName>;
	descriptionLocalizations?: Record<string, string>;
	dmPermission?: boolean;
	nameLocalizations?: Record<string, string>;
	toJson?: CreateApplicationCommandOptions;
	superUserOnly?: boolean;
	helperUserOnly?: boolean;
	disabled?: boolean;
	nsfw?: boolean;
	premiumOnly?: boolean;
}

/**
 * Creates a new command
 * @param props The command properties
 * @returns
 */
export function CreateCommand(props: Command): CommandDataProp {
	return {
		props,
		toJson: () => {
			const builder = new ApplicationCommandBuilder(props.type, props.trigger).setDescription(props.description);
			props.options?.(builder);
			if (props.defaultMemberPermissions !== undefined) {
				builder.setDefaultMemberPermissions(props.defaultMemberPermissions);
			}
			if (props.descriptionLocalizations !== undefined) {
				builder.setDescriptionLocalizations(props.descriptionLocalizations);
			}
			if (props.dmPermission !== undefined) {
				builder.setDMPermission(props.dmPermission);
			}
			if (props.nameLocalizations !== undefined) {
				builder.setNameLocalizations(props.nameLocalizations);
			}
			return builder.toJSON();
		}
	};
}

/**
 * 
 * import { ApplicationCommandTypes } from 'oceanic.js';
import { CreateCommand } from '../../lib/command.js';

export default CreateCommand({
	trigger: '',
	description: ``,
	type: ApplicationCommandTypes.CHAT_INPUT,
	options: (command) => {},
	register: {
		guild: true,
		global: false
	},
	run: async (_instance, interaction) => {}
});
 */

/**
 * Creates Guild Commands for the bot
 * @param client The Discord Client
 */
export async function CreateGuildCommands(client: Client) {
	try {
		const commandsArray = MainInstance.collections.commands.commandStoreArrayJsonGuild;

		for (const guilds of config.DevelopmentServerId) {
			await client.application.bulkEditGuildCommands(guilds, commandsArray);
			console.log(`[INFO] Successfully created ${commandsArray.length} commands in guild ${guilds}`);
		}

		await MainInstance.utils.sendToLogChannel('api', {
			content: `Successfully created ${commandsArray.length} commands in all guilds!`
		});

		console.log(`[INFO] Successfully created ${commandsArray.length} commands in all guilds`);
	} catch (err) {
		console.error(`[ERROR] Failed to create guild commands`, err);

		await MainInstance.utils.sendToLogChannel('error', {
			content: `Failed to create guild commands!\n ${err}`
		});
	}

	console.log('[INFO] Created Guild Commands');
}

/**
 * Creates the global commands for the bot
 * @param client The Discord Client
 */
export async function CreateGlobalCommands(client: Client) {
	try {
		const commandsArray = MainInstance.collections.commands.commandStoreArrayJsonGlobal;

		await client.application.bulkEditGlobalCommands(commandsArray);

		console.log(`[INFO] Successfully created ${commandsArray.length} commands globally`);

		await MainInstance.utils.sendToLogChannel('api', {
			content: `Successfully created ${commandsArray.length} commands globally!`
		});
	} catch (err) {
		console.error(`[ERROR] Failed to create global commands`, err);

		await MainInstance.utils.sendToLogChannel('error', {
			content: `Failed to create global commands!\n ${err}`
		});
	}
}

/**
 * Deletes Guild Based Commands for the bot
 * @param client The Discord Client
 */
export async function deleteGuildCommands(client: Client) {
	// Delete Commands from the API
	for (const guild of config.DevelopmentServerId) {
		await client.application.bulkEditGuildCommands(guild, []).catch((err) => {
			console.log(err);
			MainInstance.utils.sendToLogChannel('error', {
				content: `Failed to delete commands in guild ${guild}!\n ${err}`
			});
		});

		await MainInstance.utils.sendToLogChannel('api', {
			content: `Successfully deleted all commands in guild ${guild}!`
		});
	}
}

/**
 * Deletes Global Commands for the bot
 * @param client The Discord Client
 */
export async function deleteGlobalCommands(client: Client) {
	// Delete Commands from the API
	await client.application.bulkEditGlobalCommands([]).catch((err) => {
		console.log(err);
		MainInstance.utils.sendToLogChannel('error', {
			content: `Failed to delete commands globally!\n ${err}`
		});
	});

	await MainInstance.utils.sendToLogChannel('api', {
		content: `Successfully deleted all commands globally!`
	});
}
