import { Schema, Model, model } from 'mongoose';
import type { GlobalStatistics } from '../../../typings/database/types.js';

const GlobalStatsSchema = new Schema<GlobalStatistics>({
	find_id: { type: String, required: true, default: 'global' },

	guilds_joined: { type: Number, required: true, default: 0 },
	guilds_left: { type: Number, required: true, default: 0 },

	commands_executed: { type: Number, required: true, default: 0 },
	commands_failed: { type: Number, required: true, default: 0 }
});

export const GlobalStatsModel: Model<GlobalStatistics> = model('global-statistics', GlobalStatsSchema);
