/**
 *  Code Goblin - A discord bot for programmers.

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

import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions, Store } from '@sapphire/framework';
import { ActivityType, Message } from 'discord.js';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { Main } from '..';
import { ServerConfigModel } from '../database/mongodb/models/config';
import { PremiumUserModel } from '../database/mongodb/models/premium';
import { TagModel } from '../database/mongodb/models/tag';
import { WelcomeModel } from '../database/mongodb/models/welcome';
import { GoodbyeModel } from '../database/mongodb/models/goodbye';
import { UserReputationModel } from '../database/mongodb/models/reputation';

const dev = Main.config.IsInDevelopmentMode;

@ApplyOptions<ListenerOptions>({
	event: Events.ClientReady
})
export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	public async run(_ctx: Message): Promise<void> {
		const { client } = this.container;

		client.user?.setPresence({
			status: 'online',
			activities: [
				{
					name: 'with Chat-GTP',
					type: ActivityType.Playing
				}
			]
		});
		await this.initializeFunctions().then(() =>
			this.container.logger.info(`${client.user?.tag} is online and ready to compute ${client.guilds.cache.size} guilds!`)
		);
	}

	private async initializeFunctions() {
		await Main.database.mongodb.init();
		await ServerConfigModel.initCache();
		await UserReputationModel.initCache();
		await PremiumUserModel.initCache();
		await TagModel.initCache();
		await WelcomeModel.initCache();
		await GoodbyeModel.initCache();
		await this.clearApplicationCommands(Main.config.commands.delete);
		UserEvent.printBanner();
		this.printStoreDebugInformation();
	}

	private async clearApplicationCommands(enabled: boolean) {
		if (!enabled) return;
		else {
			const { client } = this.container;
			if (Main.config.IsInDevelopmentMode) {
				// Loop over each test server and clear the application commands
				for (const id of [Main.config.DevelopmentGuildId]) {
					await client.application?.commands.set([], id).then((res) => {
						if (res) this.container.logger.warn(`Cleared application commands in ${id}`);
						else this.container.logger.warn(`Failed to clear application commands in ${id}`);
					});
				}
			} else {
				// Clear the application commands in the main server
				await client.application?.commands.set([]).then((res) => {
					if (res) this.container.logger.warn('Cleared application commands in main server');
					else this.container.logger.warn('Failed to clear application commands in main server');
				});
			}
			client.logger.fatal('Application commands have been cleared!');
		}
	}

	private static printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}
