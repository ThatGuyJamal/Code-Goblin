import type { ImagesResponseDataInner } from 'openai';
import type { AxiosRequestConfig } from 'axios';

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
