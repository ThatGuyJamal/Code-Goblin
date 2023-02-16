import { config } from '../config';
import winston from 'winston';
import { format } from 'logform';

export class ILogger {
	private instance;
	private readonly IsInDevelopmentMode: boolean;
	public constructor() {
		this.IsInDevelopmentMode = config.IsInDevelopmentMode;

		this.instance = winston.createLogger({
			level: 'info',
			format: winston.format.json(),
			defaultMeta: { service: 'bot' },
			transports: [
				new winston.transports.File({ filename: './logs/info.log', level: 'info', maxsize: 100_000, maxFiles: 1 }),
				new winston.transports.File({ filename: './logs/error.log', level: 'error', maxsize: 100_000, maxFiles: 2 }),
				new winston.transports.File({ filename: './logs/debug.log', level: 'debug', maxsize: 100_000, maxFiles: 2 }),
				new winston.transports.File({ filename: './logs/warn.log', level: 'warn', maxsize: 100_000, maxFiles: 1 })
			]
		});

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

	/**
	 * Log a message at the 'info' level
	 * @param message
	 * @param args
	 */
	public info(message: string, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.info(message, ...args);
	}

	/**
	 * Log a message at the 'error' level
	 * @param message
	 * @param args
	 * @returns
	 */
	public error(message: any, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.error(message, ...args);
	}

	/**
	 * Log a message at the 'error' level
	 * @param message
	 * @param args
	 * @returns
	 */
	public warn(message: string, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.warn(message, ...args);
	}
	/**
	 * Log a message at the 'debug' level
	 * @param message
	 * @param args
	 * @returns
	 */
	public debug(message: string, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.debug(message, ...args);
	}
	/**
	 * Log a message at the 'crit' level
	 * @param message
	 * @param args
	 * @returns
	 */
	public crit(message: string, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.crit(message, ...args);
	}
	/**
	 * Log a message at the 'notice' level
	 * @param message
	 * @param args
	 * @returns
	 */
	public notice(message: string, ...args: any[]) {
		if (this.IsInDevelopmentMode) this.instance.notice(message, ...args);
	}
}
