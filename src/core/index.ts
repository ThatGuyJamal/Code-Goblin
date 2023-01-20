import config from '../config/config.js';
import { logger } from '../utils/index.js';
import MainInstance from './main.js';

export const Main = new MainInstance();

export async function bootstrapCore() {
	if (config.IsInDevelopmentMode && !config.register_commands.create.guild) {
		logger.warn('[WARNING] Guild only commands are disabled and we are not in production mode.');
	}

	await Main.init();

	console.log('Node Process Online');
}
