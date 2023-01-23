import { RateLimitManager } from '@sapphire/ratelimits';
import { InteractionCollector } from 'oceanic-collectors';
import {
	ApplicationCommandOptionTypes,
	ApplicationCommandTypes,
	ButtonStyles,
	CommandInteraction,
	ComponentInteraction,
	ComponentTypes,
	InteractionTypes
} from 'oceanic.js';
import type { CreateImageRequest } from 'openai';
import { isCanary } from '../../../config/config.js';
import { CollectorValues } from '../../../typings/api/types.js';
import constants, { Milliseconds } from '../../../utils/constants.js';
import type Main from '../../main.js';
import { CreateCommand } from '../../structures/command.js';

const variationCache = new Set();

export default CreateCommand({
	trigger: 'imagine',
	description: `Imagine the impossible`,
	type: ApplicationCommandTypes.CHAT_INPUT,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	options: (opt) => {
		opt.addOption('prompt', ApplicationCommandOptionTypes.STRING, (opt) => {
			opt.setName('prompt').setDescription('The prompt to generate').setRequired(true).setMinMax(1, 1024);
		}).setDMPermission(false);
	},
	premiumOnly: true,
	ratelimit: {
		user: new RateLimitManager(Milliseconds.MINUTE * 5, 2),
		guild: new RateLimitManager(Milliseconds.HOUR * 1, 20)
	},
	register: isCanary ? 'guild' : 'global',
	run: async ({ instance, interaction }) => {
		await CreateImage(instance, interaction.data.options.getString('prompt', true), interaction);
	}
});

/**
 * Creates an image from a prompt
 * @param instance
 * @param Prompt
 * @param interaction
 * @param Variation
 * @returns
 */
async function CreateImage(instance: Main, Prompt: string, interaction: CommandInteraction | ComponentInteraction, Variation?: string) {
	await interaction.defer();

	try {
		if (variationCache.has(interaction.user.id)) {
			return await interaction.editOriginal({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
					\`\`\`asciidoc
					• Error :: You cant create another ${Variation ? 'variation' : 'image'}! Please wait...
					\`\`\`
					`
						),
						color: constants.numbers.colors.primary,
						footer: {
							text: `Requested by ${interaction.user.tag}`
						},
						timestamp: new Date().toISOString()
					}
				],
				flags: 64,
				allowedMentions: {
					repliedUser: true
				}
			});
		}

		await interaction.editOriginal({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
					\`\`\`asciidoc
					• Info :: Generating ${Variation ? 'variation' : 'image'}...
					\`\`\`
					`
					),
					color: constants.numbers.colors.primary,
					footer: {
						text: `Requested by ${interaction.user.tag}`
					},
					timestamp: new Date().toISOString()
				}
			]
		});

		const imageOptions: CreateImageRequest = {
			prompt: Prompt,
			n: 1,
			size: '1024x1024',
			response_format: 'url',
			user: interaction.user.id
		};

		const image = Variation
			? await instance.collections.openai.image.GenerateVariation({
					image: await instance.collections.openai.image.GetBufferFromURL(Variation),
					...(imageOptions as any)
			  })
			: await instance.collections.openai.image.GenerateImage({ ...imageOptions });

		const imageURL = image ? image[0].Response.url : null;

		if (!image || !imageURL) {
			return interaction.editOriginal({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: Failed to generate ${Variation ? 'variation' : 'image'}!
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary,
						footer: {
							text: `Requested by ${interaction.user.tag}`
						},
						timestamp: new Date().toISOString()
					}
				],
				allowedMentions: {
					repliedUser: true
				},
				flags: 64
			});
		}

		await interaction.editOriginal({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
					\`\`\`asciidoc
					• Info :: Generated ${Variation ? 'variation' : 'image'}!
					\`\`\`
					`
					),
					color: constants.numbers.colors.primary,
					footer: {
						text: `Requested by ${interaction.user.tag}`
					},
					timestamp: new Date().toISOString()
				}
			]
		});

		const message = await interaction.editOriginal({
			embeds: [
				{
					title: `${Variation ? 'Variated' : 'Imagined'} the unimagined! ✨`,
					description: `Given prompt: ${Prompt}`,
					image: {
						url: imageURL
					},
					color: constants.numbers.colors.primary
				}
			],
			components: [
				{
					type: ComponentTypes.ACTION_ROW,
					components: [
						{
							type: ComponentTypes.BUTTON,
							style: ButtonStyles.LINK,
							label: 'Source',
							url: imageURL
						},
						{
							type: ComponentTypes.BUTTON,
							style: ButtonStyles.SECONDARY,
							customID: 'Variation',
							label: 'Create variation?'
						}
					]
				}
			],
			allowedMentions: {
				repliedUser: true
			}
		});

		const collector = new InteractionCollector(instance.DiscordClient, {
			message: message,
			interactionType: InteractionTypes.MESSAGE_COMPONENT,
			componentType: ComponentTypes.BUTTON,
			idle: CollectorValues.variationExpiresAfter,
			filter: (i) => i.user.id === interaction.user.id
		});

		collector.on('collect', async (i) => {
			await CreateImage(
				instance,
				Prompt,
				i,
				imageURL
			).then(() => {
				// Adding user to variation cache to prevent spamming
				// todo - fix bug where users can spam the button and create multiple variations even if they are in the cache
				variationCache.add(interaction.user.id);
				instance.logger.info('Variation cache added user: ' + interaction.user.id);
			});
		});

		collector.on('end', async (i) => {
			if (variationCache.has(interaction.user.id)) {
				variationCache.delete(interaction.user.id);
				instance.logger.info('Variation cache removed user: ' + interaction.user.id);
			}
			await interaction.editOriginal({
				components: [
					{
						type: ComponentTypes.ACTION_ROW,
						components: [
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Source',
								url: imageURL
							}
						]
					}
				]
			});
		});
	} catch (error: any) {
		if (error.response) {
			instance.logger.error(error.response.status);
			instance.logger.error(error.response.data);
			await interaction.createFollowup({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
						**Notice**
						\`\`\`asciidoc
						• Error :: Error while generating ${Variation ? 'variation' : 'image'}!
						\`\`\`
						**${error.response.status}**
						\`\`\`
						${error.response.data}
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary,
						footer: {
							text: `Requested by ${interaction.user.tag}`
						},
						timestamp: new Date().toISOString()
					}
				],
				flags: 64
			});
		} else {
			instance.logger.error(error.message);
			await interaction.createFollowup({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
						**Notice**
						\`\`\`asciidoc
						• Error :: Error while generating ${Variation ? 'variation' : 'image'}!
						\`\`\`
						**Error**
						\`\`\`
						${error.message}
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary,
						footer: {
							text: `Requested by ${interaction.user.tag}`
						},
						timestamp: new Date().toISOString()
					}
				],
				flags: 64
			});
		}
	}
}
