import mongoose from 'mongoose';
import config from '../../config/config.js';
import type { Main } from '../../core/index.js';
import type { NetworkStatusReturnTypes } from '../../typings/database/types.js';
import { GoodbyeModel } from './models/goodbye.js';
import { CodeJamModel } from './models/jam.js';
import { PremiumUserModel } from './models/premium.js';
import { GlobalStatsModel } from './models/statistics.js';
import { TagModel } from './models/tag.js';
import { WelcomeModel } from './models/welcome.js';

export class MongodbDatabase {
	instance: typeof Main;

	/** Access core methods for the database */
	public schemas;

	public constructor(m: typeof Main) {
		this.instance = m;
		this.schemas = {
			automation: {
				goodbye: GoodbyeModel,
				welcome: WelcomeModel
			},
			tag: TagModel,
			jam: CodeJamModel,
			premiumUser: PremiumUserModel,
			statistics: GlobalStatsModel
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
