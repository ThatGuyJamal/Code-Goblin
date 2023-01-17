import config from './config/config.js';
import winston from 'winston';
import { format } from 'logform';

export class ILogger {
	private instance;
	private IsInDevelopmentMode: boolean;
	public constructor() {
		this.instance = winston.createLogger({
			level: 'info',
			format: winston.format.json(),
			defaultMeta: { service: 'logger-service' },
			transports: [
				//
				// - Write all logs with importance level of `error` or less to `error.log`
				// - Write all logs with importance level of `info` or less to `combined.log`
				//
				new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
				new winston.transports.File({ filename: './logs/combined.log' })
			]
		});

		this.IsInDevelopmentMode = config.IsInDevelopmentMode;

		if (this.IsInDevelopmentMode) {
			this.instance.add(
				new winston.transports.Console({
					format: winston.format.simple()
				})
			);
		}

		this.instance.format = format.combine(
			format.colorize(),
			format.timestamp(),
			format.align(),
			format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
		);

		this.instance.exceptions.handle(new winston.transports.File({ filename: './logs/exceptions.log' }));
	}

	/**
     *{
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
        }
     */

	public info(message: string, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.info(message, ...args);
	}

	public error(message: any, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.error(message, ...args);
	}

	public warn(message: string, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.warn(message, ...args);
	}

	public debug(message: string, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.debug(message, ...args);
	}

	public crit(message: string, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.crit(message, ...args);
	}

	public notice(message: string, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.notice(message, ...args);
	}
}
