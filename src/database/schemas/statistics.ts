import { Schema, Model, model } from 'mongoose';

export interface GlobalStatistics {
	find_id: string;

	guilds_joined: number;
	guilds_left: number;

	commands_executed: number;
	commands_failed: number;
}

const GlobalStatsSchema = new Schema<GlobalStatistics>({
	find_id: { type: String, required: true, default: 'global' },

	guilds_joined: { type: Number, required: true, default: 0 },
	guilds_left: { type: Number, required: true, default: 0 },

	commands_executed: { type: Number, required: true, default: 0 },
	commands_failed: { type: Number, required: true, default: 0 }
});

export const GlobalStatsModel: Model<GlobalStatistics> = model('global-statistics', GlobalStatsSchema);
