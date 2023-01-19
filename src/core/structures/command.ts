import { ApplicationCommandBuilder } from '@oceanicjs/builders';
import type { ApplicationCommandTypes, Client, CommandInteraction, CreateApplicationCommandOptions, Permission, PermissionName } from 'oceanic.js';
import { logger } from '../../utils/index.js';
import { Main } from '../index.js';
import config from '../../config/config.js';

export interface CommandDataProp {
	props: Command;
	toJson: () => CreateApplicationCommandOptions;
}

export type CommandRegisterType = 'global' | 'guild' | 'both';

/**
 * The type structure for a command
 */
export interface Command {
	/** The name of the command interaction data */
	trigger: string;
	description: string;
	type: ApplicationCommandTypes;
	options?: (opts: ApplicationCommandBuilder) => void;
	run: (instance: typeof Main, interaction: CommandInteraction) => Promise<any> | any;
	register?: CommandRegisterType;
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
 * 
 * import { ApplicationCommandTypes } from 'oceanic.js';
import { CreateCommand } from '../cmd/command.js';
import { isCanary } from '../config/config.js';

export default CreateCommand({
	trigger: '',
	description: ``,
	type: ApplicationCommandTypes.CHAT_INPUT,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	options: (opt) => {},
	register: isCanary ? "guild" : "global",
	run: async (_instance, interaction) => {}
});
 */

/**
 * Creates Guild Commands for the bot
 * @param client The Discord Client
 */
export async function CreateGuildCommands(client: Client) {
	try {
		const commandsArray = Main.collections.commands.commandStoreArrayJsonGuild;

		for (const guilds of config.DevelopmentServerId) {
			await client.application.bulkEditGuildCommands(guilds, commandsArray);
			logger.info(`Successfully created ${commandsArray.length} commands in guild ${guilds}`);
		}

		await Main.utils.sendToLogChannel('api', {
			content: `Successfully created ${commandsArray.length} commands in all guilds!`
		});

		logger.info(`Successfully created ${commandsArray.length} commands in all guilds`);
	} catch (err) {
		logger.error(`Failed to create guild commands`, err);

		await Main.utils.sendToLogChannel('error', {
			content: `Failed to create guild commands!\n ${err}`
		});
	}

	logger.info('Created Guild Commands');
}

/**
 * Creates the global commands for the bot
 * @param client The Discord Client
 */
export async function CreateGlobalCommands(client: Client) {
	try {
		const commandsArray = Main.collections.commands.commandStoreArrayJsonGlobal;

		await client.application.bulkEditGlobalCommands(commandsArray);

		logger.info(`Successfully created ${commandsArray.length} commands globally`);

		await Main.utils.sendToLogChannel('api', {
			content: `Successfully created ${commandsArray.length} commands globally!`
		});
	} catch (err) {
		logger.error(`Failed to create global commands`, err);

		await Main.utils.sendToLogChannel('error', {
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
			logger.error(err);
			Main.utils.sendToLogChannel('error', {
				content: `Failed to delete commands in guild ${guild}!\n ${err}`
			});
		});

		await Main.utils.sendToLogChannel('api', {
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
		logger.error(err);
		Main.utils.sendToLogChannel('error', {
			content: `Failed to delete commands globally!\n ${err}`
		});
	});

	await Main.utils.sendToLogChannel('api', {
		content: `Successfully deleted all commands globally!`
	});
}