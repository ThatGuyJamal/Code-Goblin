import type { Client } from 'oceanic.js';
import { isCanary } from '../config/config.js';
import { logger } from '../index.js';

export default async function debugEvent(this: Client, info: string, id?: number) {
	if (isCanary) {
		logger.debug(`[Debug${id === undefined ? '' : `/${id}`}]:`, info);
	}
}
