// todo
import { Schema, Model, model } from 'mongoose';

export type ContentType = 'text' | 'embed';

export interface Welcome {
	guild_id: string;
	channel_id: string;
	content_type: ContentType;
	content: string;
	enabled: boolean;
}

const welcomeSchema = new Schema<Welcome>({
	guild_id: { type: String, required: true },
	channel_id: { type: String, required: true },
	content_type: { type: String, required: false },
	content: { type: String, required: false },
	enabled: { type: Boolean, required: true }
});

export const WelcomeModel: Model<Welcome> = model('welcome', welcomeSchema);
