import type { Configuration, CreateImageRequest, ImagesResponseDataInner } from "openai";
import { OpenAIWrapper } from "./base";
import type { AxiosRequestConfig } from 'axios';
import { randomUUID } from 'node:crypto';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { Time } from '@sapphire/duration';
import { Collection } from 'discord.js';
import { container } from '@sapphire/framework';

export interface ImageBuffer extends Buffer {
	name: string;
}

/** The results sent to the api buffer */
export interface ImageResult {
	UUID: string;
	Response: ImagesResponseDataInner;
}

/** The results sent to the api buffer */
export interface ImageResult {
	UUID: string;
	Response: ImagesResponseDataInner;
}

/** The data used to create variations  */
export interface ImageVariationOptions {
	image: StringFile;
	n?: number;
	size?: string;
	user?: string;
	options?: AxiosRequestConfig;
}

export interface StringFile extends File {
	name: string;
}

/** Time values for the interaction collector */
export enum CollectorValues {
	variationRunTime = Time.Minute * 2,
	variationExpiresAfter = Time.Minute * 1
}


export class OpenAIImageWrapper extends OpenAIWrapper {
	private Images = new Collection<string, string>();

	public constructor(configuration: Configuration) {
		super(configuration);

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
		const Images = await this.api
			.createImage(
				{
					...OpenAIOptions,
					response_format: 'url'
				},
				AxiosOptions
			)
			.catch((error) => {
				if (error.response) {
					container.logger.error(error.response.status);
					container.logger.error(error.response.data);
				} else {
					container.logger.error(error.message);
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
		const variations = await this.api
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
					container.logger.error(error.response.status);
					container.logger.error(error.response.data);
				} else {
					container.logger.error(error.message);
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

	private clearImagesCache() {
		setInterval(() => {
			this.Images.clear();
		}, Time.Hour * 1);
	}
}