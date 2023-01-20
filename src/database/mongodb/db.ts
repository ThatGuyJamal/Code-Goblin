import mongoose from 'mongoose';
import config from '../../config/config.js';
import type { Main } from '../../core/index.js';
import type { DatabaseSchemas, NetworkStatusReturnTypes } from '../../typings/database/types.js';
import { GoodbyeModel } from './models/goodbye.js';
import { CodeJamModel } from './models/jam.js';
import { TagModel } from './models/tag.js';
import { WelcomeModel } from './models/welcome.js';

export class Database {
	instance: typeof Main;

	public schemas: DatabaseSchemas;

	public constructor(m: typeof Main) {
		this.instance = m;
		this.schemas = {
			welcome: WelcomeModel,
			goodbye: GoodbyeModel,
			tag: TagModel,
			jam: CodeJamModel
		};
	}

	/** Connects to the mongodb host */
	public async init(): Promise<void> {
		await mongoose
			.connect(config.MongoDbUri)
			.then(() => {
				this.instance.logger.info('Connected to Mongodb!');
			})
			.catch((err) => {
				this.instance.logger.error(`Error connecting to the database: ${err}`);
			});
	}

	/**
	 * Checks if the database is connected
	 * @returns { NetworkStatusReturnTypes } The status of the database
	 */
	public network_status(): NetworkStatusReturnTypes {
		return {
			connected: mongoose.connection.readyState === 1,
			status: mongoose.connection.readyState
		};
	}
}
