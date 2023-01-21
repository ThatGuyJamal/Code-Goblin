import type { ImagesResponseDataInner } from "openai";
import type { AxiosRequestConfig } from 'axios';

export interface ImageBuffer extends Buffer {
	name: string;
}

/** The results sent to the api buffer */
export interface ImageResult {
	UUID: string;
	Response: ImagesResponseDataInner;
}
export interface ImageBuffer extends Buffer {
	name: string;
}

/** The results sent to the api buffer */
export interface ImageResult {
	UUID: string;
	Response: ImagesResponseDataInner;
}

export interface ImageVariationOptions {
	image: File;
	n?: number;
	size?: string;
	user?: string;
	options?: AxiosRequestConfig;
}