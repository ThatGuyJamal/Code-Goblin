import config from './config/config.js';
import { ILogger } from './logger.js';
import { MainInstance } from './main.js';

export const logger = new ILogger();

async function bootstrap() {
	if (config.IsInDevelopmentMode && !config.register_commands.create.guild) {
		logger.warn('[WARNING] Guild only commands are disabled and we are not in production mode.');
	}

	await MainInstance.init();

	console.log('Ready!');
}

process
	.on('unhandledRejection', (err, promise) => {
		logger.error('Unhandled Rejection:', err, promise);
	})
	.on('uncaughtException', (err) => {
		logger.error('Uncaught Exception:', err);
	})
	.on('uncaughtExceptionMonitor', (err, origin) => {
		logger.error('Uncaught Exception Monitor:', err, origin);
	});

bootstrap();
