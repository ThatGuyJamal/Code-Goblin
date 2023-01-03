import type { Client } from 'oceanic.js';
import { isCanary } from '../config/config.js';

export default async function debugEvent(this: Client, info: string, id?: number) {
	if (isCanary) {
		console.debug(`[Debug${id === undefined ? '' : `/${id}`}]:`, info);
	}
}
