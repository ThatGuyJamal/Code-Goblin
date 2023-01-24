import { Schema, Model, model } from 'mongoose';
import type { WelcomeSchema } from '../../../typings/database/types.js';

const welcomeSchema = new Schema<WelcomeSchema>({
	guild_id: { type: String, required: true },
	channel_id: { type: String, required: true },
	content_type: { type: String, required: false },
	content: { type: String, required: false },
	enabled: { type: Boolean, required: true }
});

export const WelcomeModel: Model<WelcomeSchema> = model('welcome', welcomeSchema);
