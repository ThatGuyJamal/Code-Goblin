import config from './config/config.js';
import { MainInstance } from './main.js';

export const isCanary = false;

async function bootstrap() {
	if (config.IsInDevelopmentMode && !config.register_commands.create.guild) {
		console.log('[WARNING] Guild only commands are disabled and we are not in production mode.');
	}

	await MainInstance.init();
}

process
	.on('unhandledRejection', (err, promise) => {
		console.error('Unhandled Rejection:', err, promise);
	})
	.on('uncaughtException', (err) => {
		console.error('Uncaught Exception:', err);
	})
	.on('uncaughtExceptionMonitor', (err, origin) => {
		console.error('Uncaught Exception Monitor:', err, origin);
	});

bootstrap();
