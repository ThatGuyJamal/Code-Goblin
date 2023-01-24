// todo
import { Schema, type Model, model } from 'mongoose';
import type { GoodbyeSchema } from '../../../typings/database/types.js';

const goodbyeSchema = new Schema<GoodbyeSchema>({
	guild_id: { type: String, required: true },
	channel_id: { type: String, required: true },
	content_type: { type: String, required: false },
	content: { type: String, required: false },
	enabled: { type: Boolean, required: true }
});

export const GoodbyeModel: Model<GoodbyeSchema> = model('goodbye', goodbyeSchema);
