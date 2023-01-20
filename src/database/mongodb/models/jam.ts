import { Schema, Model, model } from 'mongoose';
import type { CodeJamSchema } from '../../../typings/database/types.js';

const JamSchema = new Schema<CodeJamSchema>({
	guild_id: { type: String, required: true },

	event_role_id: { type: String, required: false, default: null },
	event_managers_role_id: { type: String, required: false, default: null },
	event_participants_ids: { type: [String], required: false, default: [] },
	event_managers_ids: { type: [String], required: false, default: [] },
	event_channel: { type: String, required: false, default: null },

	name: { type: String, required: false },
	description: { type: String, required: false },

	event_image_url: { type: String, required: false, default: null },
	event_scheduled_start_time: { type: String, required: false, default: null },
	event_scheduled_end_time: { type: String, required: false, default: null },
	entityType: { type: String, required: false, default: null },

	created_by_name: { type: String, required: false, default: null },
	created_by_id: { type: String, required: false, default: null },
	created_at: { type: Date, required: false, default: new Date() }
});

export const CodeJamModel: Model<CodeJamSchema> = model('code-jams', JamSchema);
