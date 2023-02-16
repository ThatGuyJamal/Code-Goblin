import { EmbedBuilder } from '@oceanicjs/builders';
import { RateLimitManager } from '@sapphire/ratelimits';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes, TextChannel } from 'oceanic.js';
import { isCanary } from '../../config/config.js';
import { Milliseconds } from '../../utils/constants.js';
import { logger } from '../../utils/index.js';
import { CreateCommand } from '../structures/command.js';

export default CreateCommand({
	trigger: 'embed-generate',
	description: `Create simple message embeds`,
	type: ApplicationCommandTypes.CHAT_INPUT,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'MANAGE_MESSAGES'],
	ratelimit: {
		user: new RateLimitManager(Milliseconds.SECOND * 7, 1)
	},
	options: (opt) => {
		opt.setName('embed-generate')
			.setDescription('Generate an embed')

			.addOption('title', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('title').setDescription('The title of the embed');
			})
			.addOption('description', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('description').setDescription('The description of the embed');
			})
			.addOption('color', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('color').setDescription('The color of the embed').setMinMax(1, 7);
			})
			.addOption('footer', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('footer').setDescription('The footer of the embed');
			})
			.addOption('thumbnail', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('thumbnail').setDescription('The thumbnail of the embed');
			})
			.addOption('image', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('image').setDescription('The image of the embed');
			})
			.addOption('author', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('author').setDescription('The author of the embed');
			})
			.addOption('url', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('url').setDescription('The url of the embed');
			})
			.addOption('timestamp', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('timestamp').setDescription('The timestamp of the embed. Type "true" to enable');
			})
			.addOption('field-1-name', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('name-1').setDescription('The field 1 name of the embed');
			})
			.addOption('field-1-value', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('value-1').setDescription('The field 1 value of the embed');
			})
			.addOption('field-2-name', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('name-2').setDescription('The field 2 name of the embed');
			})
			.addOption('field-2-value', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('value-2').setDescription('The field 2 value of the embed');
			})
			.addOption('channel', ApplicationCommandOptionTypes.CHANNEL, (option) => {
				option.setName('channel').setDescription('The channel to send the embed to').setChannelTypes([ChannelTypes.GUILD_TEXT]);
			})
			.addOption('embed-content', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('content').setDescription('The content before a message embed');
			})
			.setDMPermission(false);
	},
	register: isCanary ? 'guild' : 'global',
	run: async ({ instance, interaction }) => {
		try {
			const title = interaction.data.options.getString('title');
			const description = interaction.data.options.getString('description');
			const color = interaction.data.options.getString('color');
			const footer = interaction.data.options.getString('footer');
			const thumbnail = interaction.data.options.getString('thumbnail');
			const image = interaction.data.options.getString('image');
			const author = interaction.data.options.getString('author');
			const url = interaction.data.options.getString('url');
			const timestamp = interaction.data.options.getString('timestamp');
			const field1name = interaction.data.options.getString('name-1');
			const field1value = interaction.data.options.getString('value-1');
			const field2name = interaction.data.options.getString('name-2');
			const field2value = interaction.data.options.getString('value-2');
			const embedContent = interaction.data.options.getString('content');

			const channel = interaction.data.options.getChannel('channel') as unknown as TextChannel;

			const embed = new EmbedBuilder();
			await interaction.defer(64);

			// If no options are given return
			if (
				!title &&
				!description &&
				!color &&
				!footer &&
				!thumbnail &&
				!image &&
				!author &&
				!url &&
				!timestamp &&
				!field1name &&
				!field1value &&
				!field2name &&
				!field2value &&
				!channel &&
				!embedContent
			) {
				return await interaction.createFollowup({ content: `No option given to create an embed.` });
			}

			if (title) embed.setTitle(title);
			if (description) embed.setDescription(description);
			if (color) embed.setColor(Number(color));
			if (footer) embed.setFooter(footer);
			if (thumbnail) embed.setThumbnail(thumbnail);
			if (image) embed.setImage(image);
			if (author) embed.setAuthor(author);
			if (url) embed.setURL(url);
			if (timestamp) embed.setTimestamp(new Date().toISOString());
			if (field1name && field1value) embed.addField(field1name, field1value);
			if (field2name && field2value) embed.addField(field2name, field2value);

			if (channel) {
				let ch = interaction.guild?.channels.get(channel.id) as TextChannel;

				// If the channel doesn't exist  return
				if (!ch) return await interaction.createFollowup({ content: `I could not find the channel to send the embed to.` });

				// check if we have permission to send messages in the channel
				if (
					!ch.permissionsOf(interaction.client.user.id).has('SEND_MESSAGES') &&
					!ch.permissionsOf(interaction.client.user.id).has('EMBED_LINKS')
				) {
					return await interaction.createFollowup({
						content: `I do not have permission to send messages in ${channel.mention}. The embed was not created!`
					});
				}

				if (
					embedContent &&
					!title &&
					!description &&
					!color &&
					!footer &&
					!thumbnail &&
					!image &&
					!author &&
					!url &&
					!timestamp &&
					!field1name &&
					!field1value &&
					!field2name &&
					!field2value
				) {
					// Send the embed
					let send2 = await ch.createMessage({
						content: embedContent ? embedContent : undefined
					});

					return await interaction.createFollowup({
						content: `Message sent to ${channel.mention} successfully!`,
						embeds: [
							{
								description: `[View Message](${instance.utils.messageLink(ch.id, send2.id, interaction.guild!.id)}).`
							}
						]
					});
				}

				// Send the embed
				let send = await ch.createMessage({
					content: embedContent ? embedContent : undefined,
					embeds: [embed.toJSON()]
				});

				// Send a followup message
				return await interaction.createFollowup({
					content: `Embed sent to ${channel.mention} successfully!`,
					embeds: [
						{
							description: `[View Embed](${instance.utils.messageLink(ch.id, send.id, interaction.guild!.id)}).`
						}
					]
				});
			}

			if (!channel) {
				if (
					embedContent &&
					!title &&
					!description &&
					!color &&
					!footer &&
					!thumbnail &&
					!image &&
					!author &&
					!url &&
					!timestamp &&
					!field1name &&
					!field1value &&
					!field2name &&
					!field2value
				) {
					await interaction.channel?.createMessage({ content: embedContent }).catch(() => null);

					return await interaction.createFollowup({
						content: `Message created successfully!`
					});
				}

				await interaction.channel
					?.createMessage({ content: embedContent ? embedContent : undefined, embeds: [embed.toJSON()] })
					.catch(() => null);

				return await interaction.createFollowup({
					content: `Embed created successfully!`
				});
			}

			return await interaction.createFollowup({
				content: `Somethings not right...`
			});
		} catch (error) {
			logger.error(error);
			return await interaction.createFollowup({
				content: `Something went wrong! Please try again...`
			});
		}
	}
});