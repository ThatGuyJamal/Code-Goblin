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
import { Main } from '../index';
import { PermissionsBitField, TextChannel } from 'discord.js';
import { TagLimits, TagModel } from '../database/mongodb/models/tag';
import { BrandingColors } from '../utils/constants';

@ApplyOptions<ExtendedCommandOptions>({
	name: 'tag',
	description: 'Use this command to create, edit, view,  or delete a tag.',
	cooldownDelay: Time.Second * 5,
	enabled: true
})
export class NewCommand extends ExtendedCommand {
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
			case 'create':
				await this.create(interaction);
				break;
			case 'edit':
				await this.edit(interaction);
				break;
			case 'delete':
				await this.delete(interaction);
				break;
			case 'list':
				await this.list(interaction);
				break;
			case 'search':
				await this.search(interaction);
				break;
			case 'clear':
				await this.clear(interaction);
				break;
			default:
				await interaction.reply({ content: 'Invalid subcommand.', ephemeral: true });
		}
	}

	private async create(interaction: Command.ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.inCachedGuild()) return;
		if (!interaction.member) return;

		const { guild } = interaction;

		if (!interaction.guild.members.cache.get(interaction.user.id)!.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return await interaction.editReply({
				embeds: [
					{
						description: this.container.utilities.format.stripIndents(
							`
\`\`\`asciidoc
• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:invalid_bot_permissions', {
								replace: {
									permissions: this.container.utilities.format.permissionsToString(PermissionsBitField.Flags.ManageGuild)
								}
							})}
\`\`\`
`
						),
						color: BrandingColors.Error,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		const tagName = interaction.options.getString('name', true);
		const tagContent = interaction.options.getString('content', true);

		const limits = await TagModel.CheckIfLimited(guild.id);

		if (limits) {
			return await interaction.editReply({
				embeds: [
					{
						description: this.container.utilities.format.stripIndents(
							`
\`\`\`asciidoc
• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.create_limit_reached', {
								replace: {
									limit: TagLimits.MAX_CREATED_TAGS
								}
							})}
\`\`\`
`
						),
						color: BrandingColors.Error,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		const exist = await TagModel.CheckIfTagExists(guild.id, tagName);

		if (exist) {
			return await interaction.editReply({
				embeds: [
					{
						description: this.container.utilities.format.stripIndents(
							`
\`\`\`asciidoc
• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.exists', {
								replace: {
									name: tagName
								}
							})}
\`\`\`
`
						),
						color: BrandingColors.Error,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		await TagModel.CreateTag({
			guild_id: guild.id,
			name: tagName,
			content: tagContent,
			created_by_id: interaction.user.id,
			created_by_name: interaction.user.tag
		});

		return await interaction.editReply({
			embeds: [
				{
					description: this.container.utilities.format.stripIndents(
						`
\`\`\`asciidoc
• Success :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.created', {
							replace: {
								name: tagName
							}
						})}
\`\`\`
`
					)
				}
			]
		});
	}

	private async edit(interaction: Command.ChatInputCommandInteraction) {
		await interaction.deferReply();

		if (!interaction.inCachedGuild()) return;
		if (!interaction.member) return;

		const { guild } = interaction;

		if (!interaction.guild.members.cache.get(interaction.user.id)!.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return await interaction.editReply({
				embeds: [
					{
						description: this.container.utilities.format.stripIndents(
							`
\`\`\`asciidoc
• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:invalid_bot_permissions', {
								replace: {
									permissions: this.container.utilities.format.permissionsToString(PermissionsBitField.Flags.ManageGuild)
								}
							})}
\`\`\`
`
						),
						color: BrandingColors.Error,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		const tagName = interaction.options.getString('name', true);
		const tagContent = interaction.options.getString('content', true);

		const exist = await TagModel.CheckIfTagExists(guild.id, tagName);

		if (!exist) {
			return await interaction.editReply({
				embeds: [
					{
						description: this.container.utilities.format.stripIndents(
							`
\`\`\`asciidoc
• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.does_not_exist', {
								replace: {
									name: tagName
								}
							})}
\`\`\`
`
						),
						color: BrandingColors.Error,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		await TagModel.UpdateTag({
			guild_id: guild.id,
			name: tagName,
			content: tagContent
		});

		return await interaction.editReply({
			embeds: [
				{
					description: this.container.utilities.format.stripIndents(
						`
\`\`\`asciidoc
• Success :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.edited', {
							replace: {
								name: tagName
							}
						})}
\`\`\`
`
					),
					color: BrandingColors.Primary,
					timestamp: new Date().toISOString()
				}
			]
		});
	}

	private async delete(interaction: Command.ChatInputCommandInteraction) {
		await interaction.deferReply();

		if (!interaction.inCachedGuild()) return;
		if (!interaction.member) return;

		const { guild } = interaction;

		if (!interaction.guild.members.cache.get(interaction.user.id)!.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return await interaction.editReply({
				embeds: [
					{
						description: this.container.utilities.format.stripIndents(
							`
\`\`\`asciidoc
• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:invalid_bot_permissions', {
								replace: {
									permissions: this.container.utilities.format.permissionsToString(PermissionsBitField.Flags.ManageGuild)
								}
							})}
\`\`\`
`
						),
						color: BrandingColors.Error,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		const tagName = interaction.options.getString('name', true);

		const exist = await TagModel.CheckIfTagExists(guild.id, tagName);

		if (!exist) {
			return await interaction.editReply({
				embeds: [
					{
						description: this.container.utilities.format.stripIndents(
							`
\`\`\`asciidoc
• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.does_not_exist', {
								replace: {
									name: tagName
								}
							})}
\`\`\`
`
						),
						color: BrandingColors.Error,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		await TagModel.DeleteTag(guild.id, tagName);

		return await interaction.editReply({
			embeds: [
				{
					description: this.container.utilities.format.stripIndents(
						`
\`\`\`asciidoc
• Success :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.deleted', {
							replace: {
								name: tagName
							}
						})}
\`\`\`
`
					),
					color: BrandingColors.Primary,
					timestamp: new Date().toISOString()
				}
			]
		});
	}

	private async list(interaction: Command.ChatInputCommandInteraction) {
		await interaction.deferReply();

		if (!interaction.inCachedGuild()) return;
		if (!interaction.member) return;

		const { guild } = interaction;

		const tags = await TagModel.GetTags(guild.id);

		if (tags.length === 0) {
			return await interaction.editReply({
				embeds: [
					{
						description: this.container.utilities.format.stripIndents(
							`
\`\`\`asciidoc
• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.no_data')}
\`\`\`
`
						),
						color: BrandingColors.Error,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		const t = tags.map((tag) => {
			if (tag.name) {
				return tag.name;
			} else {
				return '';
			}
		});
		const displayFormattedTags = this.container.utilities.format.arrayOfStringsToStyle(t, true);

		return await interaction.editReply({
			embeds: [
				{
					title: 'All tags',
					description: displayFormattedTags,
					color: BrandingColors.Primary,
					timestamp: new Date().toISOString()
				}
			]
		});
	}

	private async search(interaction: Command.ChatInputCommandInteraction) {
		await interaction.deferReply();

		if (!interaction.inCachedGuild()) return;
		if (!interaction.member) return;

		const { guild } = interaction;

		const tagName = interaction.options.getString('name', true);
		const tagMention = interaction.options.getUser('mention', false);

		const tag = await TagModel.GetTag(guild.id, tagName);

		if (!tag) {
			return await interaction.editReply({
				embeds: [
					{
						description: this.container.utilities.format.stripIndents(
							`
\`\`\`asciidoc
• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.does_not_exist', {
								replace: {
									name: tagName
								}
							})}
\`\`\`
`
						),
						color: BrandingColors.Error,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		return await interaction.editReply({
			content: tag
				? `${
						tagMention
							? await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.mentioned', {
									replace: {
										user: this.container.utilities.format.userMention(tagMention.id),
										author: this.container.utilities.format.userMention(interaction.user.id)
									}
							  })
							: ''
				  }\n${this.container.utilities.format.FormatPluginStringData(
						interaction.member,
						tag.content ?? (await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.not_content'))
				  )}`
				: await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.does_not_exist'),
			allowedMentions: {
				users: tagMention ? [tagMention.id] : []
			}
		});
	}

	private async clear(interaction: Command.ChatInputCommandInteraction) {
		await interaction.deferReply();

		if (!interaction.inCachedGuild()) return;
		if (!interaction.member) return;

		const { guild } = interaction;

		if (!interaction.guild.members.cache.get(interaction.user.id)!.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			return await interaction.editReply({
				embeds: [
					{
						description: this.container.utilities.format.stripIndents(
							`
\`\`\`asciidoc
• Error :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:invalid_bot_permissions', {
								replace: {
									permissions: this.container.utilities.format.permissionsToString(PermissionsBitField.Flags.ManageGuild)
								}
							})}
\`\`\`
`
						),
						color: BrandingColors.Error,
						timestamp: new Date().toISOString()
					}
				]
			});
		}

		await TagModel.DeleteTags(guild.id);

		return await interaction.editReply({
			embeds: [
				{
					description: this.container.utilities.format.stripIndents(
						`
\`\`\`asciidoc
• Success :: ${await this.t(interaction.channel as TextChannel, 'commands/plugin:tag_command.cleared')}
\`\`\`
`
					),
					color: BrandingColors.Primary
				}
			]
		});
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.setDMPermission(false)
					.addSubcommand((subcommand) =>
						subcommand
							.setName('create')
							.setDescription('Create a new tag.')
							.addStringOption((option) => option.setName('name').setDescription('The name of the tag.').setRequired(true))
							.addStringOption((option) => option.setName('content').setDescription('The content of the tag.').setRequired(true))
					)
					.addSubcommand((subcommand) =>
						subcommand
							.setName('edit')
							.setDescription('Edit an existing tag.')
							.addStringOption((option) => option.setName('name').setDescription('The name of the tag.').setRequired(true))
							.addStringOption((option) => option.setName('content').setDescription('The content of the tag.').setRequired(true))
					)
					.addSubcommand((subcommand) =>
						subcommand
							.setName('delete')
							.setDescription('Delete an existing tag.')
							.addStringOption((option) => option.setName('name').setDescription('The name of the tag.').setRequired(true))
					)
					.addSubcommand((subcommand) => subcommand.setName('list').setDescription('List all tags.'))
					.addSubcommand((subcommand) =>
						subcommand
							.setName('search')
							.setDescription('Search for a tag.')
							.addStringOption((option) => option.setName('name').setDescription('The name of the tag.').setRequired(true))
							.addUserOption((option) => option.setName('mention').setDescription('Mention a user.'))
					)
					.addSubcommand((subcommand) => subcommand.setName('clear').setDescription('Clear all tags.')),
			{
				guildIds: getGuildIds(),
				registerCommandIfMissing: Main.config.commands.register,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: ['1076313769715712000']
			}
		);
	}
}
