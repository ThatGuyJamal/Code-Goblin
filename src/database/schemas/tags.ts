import { Schema, Model, model } from 'mongoose';

export enum TagLimits {
	MAX_CREATED_TAGS = 10
}

export interface Tag {
	guild_id: string;
	name: string;
	content: string;
	created_by_name: string;
	created_by_id: string;
	created_at: Date;
	updated_at: Date | null; // null if never updated
}

const TagSchema = new Schema<Tag>({
	guild_id: { type: String, required: true },
	name: { type: String, required: true },
	content: { type: String, required: false },
	created_by_name: { type: String, required: false },
	created_by_id: { type: String, required: false },
	created_at: { type: Date, required: false },
	updated_at: { type: Date, required: false, default: null }
});

export const TagModel: Model<Tag> = model('tags', TagSchema);
