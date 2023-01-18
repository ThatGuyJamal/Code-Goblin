// todo
import { Schema, type Model, model } from 'mongoose';
import type { ContentType } from '../../welcome/schema/welcome.js';

export interface Goodbye {
	guild_id: string;
	channel_id: string;
	content_type: ContentType;
	content: string;
	enabled: boolean;
}

const GoodbyeSchema = new Schema<Goodbye>({
	guild_id: { type: String, required: true },
	channel_id: { type: String, required: true },
	content_type: { type: String, required: false },
	content: { type: String, required: false },
	enabled: { type: Boolean, required: true }
});

export const GoodbyeModel: Model<Goodbye> = model('goodbye', GoodbyeSchema);
