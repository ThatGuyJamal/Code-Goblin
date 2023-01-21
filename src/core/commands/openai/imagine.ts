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
import { openai } from '../../../api/openai_wrapper.js';
import { isCanary } from '../../../config/config.js';
import constants, { Milliseconds } from '../../../utils/constants.js';
import type Main from '../../main.js';
import { CreateCommand } from '../../structures/command.js';

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
	// todo - remove this in prod
	superUserOnly: true,
	ratelimit: {
		user: new RateLimitManager(Milliseconds.MINUTE * 1, 2),
		guild: new RateLimitManager(Milliseconds.HOUR * 100, 1)
	},
	register: isCanary ? 'guild' : 'global',
	run: async ({ instance, interaction }) => {
		await CreateImage(instance, interaction.data.options.getString('prompt', true), interaction);
	}
});

async function CreateImage(instance: Main, Prompt: string, interaction: CommandInteraction | ComponentInteraction, Variation?: string) {
	await interaction.defer(64);

	try {
		const imageOptions: CreateImageRequest = {
			prompt: Prompt,
			n: 1,
			size: '1024x1024',
			response_format: 'url',
			user: interaction.user.id
		};

		const image = Variation
			? await openai.GenerateVariation({ image: (await openai.GetBufferFromURL(Variation)) as any, ...(imageOptions as any) })
			: await openai.GenerateImage({ ...imageOptions });

		const imageURL = image ? image[0].Response.url : null;

		if (!image || !imageURL) {
			return interaction.editOriginal({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: Failed to generate image!
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
		}

		const message = await interaction.editOriginal({
			embeds: [
				{
					title: `${Variation ? 'Variated' : 'Imagined'} the unimagined! ✨`,
					description: `Given prompt: ${Prompt}`,
					image: {
						url: imageURL
					},
					color: 16106102
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
			]
		});

		const collector = new InteractionCollector(instance.DiscordClient, {
			message: message,
			interactionType: InteractionTypes.MESSAGE_COMPONENT,
			componentType: ComponentTypes.BUTTON,
			idle: 30000
		});
		collector.on('collect', (i) => CreateImage(instance, Prompt, i, imageURL));
		collector.on('end', (i) => {
			interaction.editOriginal({
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
	} catch (error) {
		return await interaction.createFollowup({
			embeds: [
				{
					description: instance.utils.stripIndents(
						`
						\`\`\`asciidoc
						• Error :: Error while generating image!
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
