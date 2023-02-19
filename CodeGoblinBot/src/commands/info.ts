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

import { ChatInputCommand, Command, RegisterBehavior } from '@sapphire/framework';
import { getGuildIds } from '../utils/utils';
import { Time } from '@sapphire/duration';
import { ExtendedCommand, ExtendedCommandOptions } from '../command';
import { ApplyOptions } from '@sapphire/decorators';
import * as os from 'os';
import { GlobalStatsModel } from '../database/mongodb/models/statistics';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Main } from '../index';
import { BrandingColors } from '../utils/constants';

type CPUUsage = { usage: number; cores: number };
type MemoryUsage = { usage: number; total: number; free: number };

@ApplyOptions<ExtendedCommandOptions>({
	name: 'info',
	description: 'Information about the bot',
	cooldownDelay: Time.Second * 10,
	enabled: true
})
export class NewCommand extends ExtendedCommand {
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const globalData = await GlobalStatsModel.GetGlobalStats();
		let dbStatus = Main.database.mongodb.network_status();

		const { guilds, users } = interaction.client;

		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(new ButtonBuilder().setURL(Main.config.BotSupportServerInvite).setLabel('Support Server').setStyle(ButtonStyle.Link))
			.addComponents(new ButtonBuilder().setURL(Main.config.BotOauthInviteLong).setLabel('Invite').setStyle(ButtonStyle.Link));

		await interaction.reply({
			embeds: [
				{
					description: this.container.utilities.format.stripIndents(`
**Bot Information**
\`\`\`asciidoc
• CPU Usage         :: ${this.getCPUUsage().usage}/100%
• Memory Usage      :: ${this.getMemoryUsage().usage}/${this.getMemoryUsage().total}%
• Guilds Cached     :: ${guilds.cache.size}
• Users Cached      :: ${users.cache.size}
• Bot API Library   :: Discord.js
• Bot Language      :: TypeScript
• Bot Developer     :: ThatGuyJamal#2695
\`\`\`
**Global Information**
\`\`\`asciidoc
• Guilds Joined     :: ${globalData!.guilds_joined ?? 0}
• Guilds Left       :: ${globalData!.guilds_left ?? 0}
• Commands Executed :: ${globalData!.commands_executed ?? 0}
• Commands Failed   :: ${globalData!.commands_failed ?? 0}
• Database Status   :: ${dbStatus.connected ? 'Connected' : 'Disconnected'}
\`\`\`
`),
					color: BrandingColors.Primary,
					footer: {
						text: `Requested by ${interaction.user.tag}`
					},
					timestamp: new Date().toISOString(),
					thumbnail: {
						url: interaction.client.user!.displayAvatarURL()
					}
				}
			],
			components: [row]
		});
	}

	private getCPUUsage(): CPUUsage {
		const cpus = os.cpus();
		let idleCpu = 0;
		let totalCpu = 0;

		for (const cpu of cpus) {
			for (const type in cpu.times) {
				//@ts-ignore
				totalCpu += cpu.times[type];
			}
			idleCpu += cpu.times.idle;
		}
		return {
			usage: 100 - ~~((100 * idleCpu) / totalCpu),
			cores: cpus.length
		};
	}

	private getMemoryUsage(): MemoryUsage {
		const freeMem = os.freemem();
		const totalMem = os.totalmem();
		return {
			usage: ~~(((totalMem - freeMem) / totalMem) * 100),
			total: ~~((totalMem / totalMem) * 100),
			free: ~~((freeMem / totalMem) * 100)
		};
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			guildIds: getGuildIds(),
			registerCommandIfMissing: Main.config.commands.register,
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			idHints: ['1076300493208428666']
		});
	}
}
