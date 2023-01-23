import config from '../config/config.js';
import { logger } from '../utils/index.js';
import MainInstance from './main.js';

// The main instance of the application. This is the entry point for the bot.
export const Main = new MainInstance();

// Starts the bot and all of its components
export async function bootstrapCore() {
	if (config.IsInDevelopmentMode && !config.register_commands.create.guild) {
		logger.warn('[WARNING] Guild only commands are disabled and we are not in production mode.');
	}

	await Main.init();

	console.log('Node Process Online');
}
