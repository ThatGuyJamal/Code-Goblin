import mongoose from 'mongoose';
import { GoodbyeModel } from './models/goodbye';
import { PremiumUserModel } from './models/premium';
import { GlobalStatsModel } from './models/statistics';
import { TagModel } from './models/tag';
import { WelcomeModel } from './models/welcome';
import {config} from "../../config";
import { container } from '@sapphire/framework';

export class MongodbDatabase {
	/** Access core methods for the database */
	public schemas;

	public constructor() {
		this.schemas = {
			automation: {
				goodbye: GoodbyeModel,
				welcome: WelcomeModel
			},
			tag: TagModel,
			premiumUser: PremiumUserModel,
			statistics: GlobalStatsModel
		};
	}

	/** Connects to the mongodb host */
	public async init(): Promise<void> {
		await mongoose
			.connect(config.MONGODB_URI)
			.then(() => {
				container.logger.info('Connected to Mongodb!');
			})
			.catch((err) => {
				container.logger.error(`Error connecting to the database: ${err}`);
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

type NetworkStatusReturnTypes = {
	connected: boolean;
	status: number;
}
