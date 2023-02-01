import { Configuration, CreateImageRequest, OpenAIApi } from 'openai';
import type { AxiosRequestConfig } from 'axios';
import { randomUUID } from 'node:crypto';
import type { ImageBuffer, ImageResult, ImageVariationOptions } from '../../typings/api/types.js';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { logger } from '../../utils/index.js';
import { Collection, TextChannel } from 'oceanic.js';
import { Queue } from '../../utils/queue.js';
import { CDN } from '../../utils/cdn.js';
import { Milliseconds } from '../../utils/constants.js';
import { Main } from '../index.js';

/**
 * The OpenAI Wrapper class
 * @class
 * @see https://beta.openai.com/docs/api-reference/images
 */
export class OpenAPIImageWrapper {
	private openAI: OpenAIApi;
	private Images = new Collection<string, string>();
	// todo implement this
	public queue = new Queue<ImageResult[]>();
	public cdn = new CDN();

	public constructor(configuration: Configuration) {
		this.openAI = new OpenAIApi(configuration);
		logger.info('OpenAI API Wrapper initialized');

		this.clearImagesCache();
	}

	/**
	 * Adds an image to the images cache
	 * @param UUID The unique identifier for the image
	 * @param ImageURL The URL of the image
	 */
	private SetImage(UUID: string, ImageURL: string) {
		this.Images.set(UUID, ImageURL);
	}

	/**
	 * Gets an image from the images cache
	 * @param UUID The unique identifier for the image
	 * @returns
	 */
	public GetImage(UUID: string): string | null {
		return this.Images.get(UUID) || null;
	}

	/**
	 * Creates a buffer from a URL
	 * @param URL The URL of the image
	 * @returns
	 */
	public async GetBufferFromURL(URL: string): Promise<ImageBuffer> {
		const ArrayBuffer = await fetch(URL, FetchResultTypes.Buffer);
		const ConvertedBuffer = Buffer.from(ArrayBuffer) as ImageBuffer;
		const FinalBuffer = ConvertedBuffer;
		FinalBuffer.name = 'image.png';
		return FinalBuffer;
	}

	/**
	 * Creates an image from the OpenAI API
	 * @param OpenAIOptions
	 * @param AxiosOptions
	 * @returns
	 */
	public async GenerateImage(OpenAIOptions: CreateImageRequest, AxiosOptions?: AxiosRequestConfig): Promise<ImageResult[]> {
		const Images = await this.openAI
			.createImage(
				{
					...OpenAIOptions,
					response_format: 'url'
				},
				AxiosOptions
			)
			.catch((error) => {
				if (error.response) {
					logger.error(error.response.status);
					logger.error(error.response.data);
				} else {
					logger.error(error.message);
				}
				return null;
			});

		if (!Images) return [];

		const result: ImageResult[] = [];

		for (const Image of Images.data.data) {
			const UUID = randomUUID();
			this.SetImage(UUID, Image.url as string);
			result.push({
				UUID: UUID,
				Response: Image
			});
		}

		return result;
	}
	/* 
	async GenerateEdit(EditOptions: {
		image: File, 
		mask: File, 
		prompt: string, 
		n?: number, 
		size?: string, 
		user?: string, 
		options?: AxiosRequestConfig
	}) {
		return await this.openAI.createImageEdit(EditOptions.image,
			EditOptions.mask,
			EditOptions.prompt,
			EditOptions.n,
			EditOptions.size,
			"url",9
			EditOptions.user,
			EditOptions.options);
	};
	Keep this commented out unless we decide to add image masking features*/

	/**
	 * Creates an image variation from the OpenAI API
	 * @param VariationOptions
	 * @returns
	 */
	public async GenerateVariation(VariationOptions: ImageVariationOptions): Promise<ImageResult[]> {
		const variations = await this.openAI
			.createImageVariation(
				VariationOptions.image,
				VariationOptions.n,
				VariationOptions.size,
				'url',
				VariationOptions.user,
				VariationOptions.options
			)
			.catch((error) => {
				if (error.response) {
					logger.error(error.response.status);
					logger.error(error.response.data);
				} else {
					logger.error(error.message);
				}
				return null;
			});

		if (!variations) return [];

		const result: ImageResult[] = [];

		for (let i = 0; i < variations.data.data.length; i++) {
			const variation = variations.data.data[i];
			const UUID = randomUUID();
			this.SetImage(UUID, variation.url as string);
			result.push({
				UUID: UUID,
				Response: variation
			});
		}

		return result;
	}

	// todo - implement this
	public async GetDiscordCDNAttachment(messageId:string, channelId: string, amount: number) {
		// const cnd_url = "https://cdn.discordapp.com/attachments/";
 
		const channel = Main.DiscordClient.getChannel<TextChannel>(channelId);

		if (!channel) return null;

		return await channel.getMessage(messageId) ?? null;
	}

	public async sendImageToChannel(channelId: string, fileUrl: string) {
		const channel = Main.DiscordClient.getChannel<TextChannel>(channelId);

		if (!channel) return null;

		await channel.createMessage({
			files: [
				{
					name: 'image.png',
					contents: await this.GetBufferFromURL(fileUrl)
				}
			]
		});
	}

	private clearImagesCache() {
		setInterval(() => {
			this.Images.clear();
		}, Milliseconds.HOUR * 1);
	}
}
