import { Schema, Model, model } from 'mongoose';

// Type def for the tag model
export interface CodeJam {
	guild_id: string;

	// The name of the code jam
	name: string;
	// The description of the code jam
	description: string;
	// The role given to participants of the code jam
	event_role_id: string | null;
	// A list of users who are participating in the code jam
	event_participants_ids: string[] | null;
	// A list of users who are managing the code jam
	event_managers_ids: string[] | null;

	event_image_url: string | null
	scheduledStartTime: Date | null;
	scheduledEndTime: Date | null;
	entityType: string | null;

	created_by_name: string;
	created_by_id: string;
	created_at: Date;
}

const JamSchema = new Schema<CodeJam>({
	guild_id: { type: String, required: true },

	event_role_id: { type: String, required: false, default: null },
	event_participants_ids: { type: [String], required: false, default: [] },
	event_managers_ids: { type: [String], required: false, default: [] },

	event_image_url: { type: String, required: false, default: null },
	scheduledStartTime: { type: Date, required: false, default: null },
	scheduledEndTime: { type: Date, required: false, default: null },
	entityType: { type: String, required: false, default: null },

	created_by_name: { type: String, required: false },
	created_by_id: { type: String, required: false },
	created_at: { type: Date, required: false }
});

export const CodeJamModel: Model<CodeJam> = model('code-jams', JamSchema);
