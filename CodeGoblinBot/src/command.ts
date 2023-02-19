/**
 *  Statistics Hub OSS - A data analytics discord bot.

 Copyright (C) 2022, ThatGuyJamal and contributors
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.
 */

import {type Args, Command as SapphireCommand, type Piece, UserError} from '@sapphire/framework';
import {fetchLanguage, resolveKey, TOptions} from '@sapphire/plugin-i18next';
import type {PermissionResolvable, TextChannel} from 'discord.js';
import {Main} from '.';
import type {SubcommandOptions} from '@sapphire/plugin-subcommands';
import type {GuildMessage} from './utils/types';

/**
 * The base class for all commands. Extends @SapphireCommand to add more functionally for our bot
 */
export abstract class ExtendedCommand extends SapphireCommand<Args, ExtendedCommandOptions> {
	/**
	 * @description The extended description.
	 * @type {ICommandExtendedDescription}
	 */
	extendedDescription: ICommandExtendedDescription | undefined;

	/**
	 * Options for command configuration.
	 * @param context The context of the command.
	 * @param options The options for the command.
	 */
	public constructor(context: Piece.Context, options: ExtendedCommandOptions) {
		super(context, {
			...options,
			// Sets the default options for all commands without having to set them explicitly in each command.
			requiredClientPermissions: ['SendMessages', 'EmbedLinks', 'UseApplicationCommands'],
			requiredUserPermissions: ['SendMessages'],
			preconditions: ['GuildOnly'],
			nsfw: false,
			generateDashLessAliases: true,
			runIn: ['GUILD_TEXT']
		});

		this.extendedDescription = options.extendedDescription;

		// If this command is owner only:
		if (this.category === 'developer') {
			// Enable it only if there is a development server on the assumption
			// it would've been registered guild wide otherwise.
			this.enabled &&= Boolean([Main.config.DevelopmentGuildId]);

			// Automatically enable the OwnerOnly precondition.
			this.preconditions.append('OwnerOnlyCommand');
		} else {
			// If the command is not in the developer category, then it needs this precondition.
			this.preconditions.append('CommandCanRun');
		}

		// If this command is disabled:
		if (this.category === 'disabled') {
			// Disable it.
			this.enabled = false;
		}
	}

	public override onLoad() {
		this.container.logger.debug(`[COMMAND]`, `Loaded ${this.name}.`);
	}

	public override onUnload() {
		this.container.logger.debug(`[COMMAND]`, `Unloaded ${this.name}.`);
	}

	/**
	 * Customized function to translate objects in our bot
	 * @param x The TextChannel instance
	 * @param path of the key to translate
	 * @param _options from i18next to pass to the translation function
	 */
	public async t(x: TextChannel, path: string, _options?: TOptions): Promise<string> {
		return await resolveKey(x, path, _options);
	}

	/**
	 * Returns the current language of the guild
	 * @param x
	 */
	public async fl(x: TextChannel | GuildMessage): Promise<string> {
		return await fetchLanguage(x);
	}

	protected error(identifier: string | UserError, context?: unknown): never {
		throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
	}
}

export interface ICommandExtendedDescription {
	usage?: string;
	examples?: string[];
	command_type?: command_type;
	hidden?: boolean;
	subcommands?: string[];
}

/**
 * @description The Bot command options interface.
 * @typedef {Object} ExtendedCommandOptions
 * @extends SubcommandOptions
 */
export interface ExtendedCommandOptions extends SubcommandOptions {
	name: string;
	description: string;
	requiredClientPermissions?: PermissionResolvable;
	extendedDescription?: ICommandExtendedDescription | undefined;
}

type command_type = 'slash' | 'message' | 'both';
