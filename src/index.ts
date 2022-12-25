import { MainInstance } from './main.js';

async function bootstrap() {
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
