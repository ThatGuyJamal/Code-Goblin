import { ChatInputCommand, Command, RegisterBehavior } from '@sapphire/framework';
import { getGuildIds, GlobalUtils } from '../utils/utils';
import { Time } from '@sapphire/duration';
import type { CreateImageRequest } from 'openai';

import { OpenAIImageWrapper } from '../openai/image';
import { config } from '../config';
import { Configuration } from 'openai';
import { AttachmentBuilder } from 'discord.js';

const ImagineAPI = new OpenAIImageWrapper(
	new Configuration({
        apiKey: config.OpenAPIkey
    })
);

export class ICommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'imagine',
			description: 'imagine the impossible',
			requiredClientPermissions: ['SendMessages', 'EmbedLinks'],
			preconditions: ['GuildOnly'],
			cooldownLimit: 5,
			cooldownDelay: Time.Minute * 1
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {

		await interaction.deferReply();

		const Prompt = interaction.options.getString('prompt', true);

		await interaction.editReply({
			content: GlobalUtils.stripIndents(
				`
					${GlobalUtils.userMention(interaction.user.id)} requested a image!
					\`\`\`asciidoc
					• Info :: Generating imagine...
					\`\`\`
					`
			),
			allowedMentions: {
				repliedUser: true,
				users: [interaction.user.id]
			}
		});

		const imageOptions: CreateImageRequest = {
			prompt: Prompt,
			n: 1,
			size: '1024x1024',
			response_format: 'url',
			user: interaction.user.id
		};

		const image = await ImagineAPI.GenerateImage({ ...imageOptions });

		const imageURL = image ? image[0].Response.url : null;

		if (!image || !imageURL) {
			return interaction.editReply({
				content: GlobalUtils.stripIndents(
					`
						${GlobalUtils.userMention(interaction.user.id)} your requested imagine failed!
						\`\`\`asciidoc
						• Error :: Failed to generate imagine due to a server error!
						\`\`\`
						`
				),
				allowedMentions: {
					users: [interaction.user.id]
				},
			});
		}

		let buffer = await ImagineAPI.GetBufferFromURL(imageURL);
		const att = new AttachmentBuilder(buffer, {
			name: 'imagine.png',
			description: 'generated imagine'
		});

		return await interaction.editReply({
			content: GlobalUtils.stripIndents(
				`
					\`\`\`asciidoc
					• Info :: Generated image Successful! Loading image into discord...
					\`\`\`
					`
			),
			allowedMentions: {
				repliedUser: true,
				users: [interaction.user.id]
			},
			files: [att]
		});
	}
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((options) => {
						return options.setName('prompt').setDescription('Imagine something and we will try to create it').setRequired(true);
					}),
			{
				guildIds: getGuildIds(),
				registerCommandIfMissing: true,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				idHints: ['1075595494702715031']
			}
		);
	}
}
