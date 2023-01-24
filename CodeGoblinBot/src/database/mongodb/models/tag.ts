import { Schema, Model, model } from 'mongoose';
import type { TagSchema } from '../../../typings/database/types.js';

const tagSchema = new Schema<TagSchema>({
	guild_id: { type: String, required: true },
	name: { type: String, required: true },
	content: { type: String, required: false },
	created_by_name: { type: String, required: false },
	created_by_id: { type: String, required: false },
	created_at: { type: Date, required: false },
	updated_at: { type: Date, required: false, default: null }
});

export const TagModel: Model<TagSchema> = model('tags', tagSchema);
