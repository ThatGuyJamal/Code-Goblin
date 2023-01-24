import { bootstrapCore } from './core/index.js';
import { logger } from './utils/index.js';

bootstrapCore();

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
