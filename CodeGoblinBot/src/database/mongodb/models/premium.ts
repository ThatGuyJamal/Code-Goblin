import { Schema, Model, model } from 'mongoose';
import type { PremiumUserSchema } from '../../../typings/database/types';

const PremiumUsersSchema = new Schema<PremiumUserSchema>({
	user_id: { type: String, required: true },
	activated: { type: Boolean, required: false, default: false },
	activated_at: { type: Number, required: false, default: null },
	expires_at: { type: Date, required: false, default: null },
	level: { type: String, required: false, default: null }
});

export const PremiumUserModel: Model<PremiumUserSchema> = model('premium-users', PremiumUsersSchema);
