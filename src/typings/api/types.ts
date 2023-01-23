import type { ImagesResponseDataInner } from 'openai';
import type { AxiosRequestConfig } from 'axios';
import { Milliseconds } from '../../utils/constants.js';

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
	variationRunTime = Milliseconds.MINUTE * 2,
	variationExpiresAfter = Milliseconds.MINUTE * 1,
}
