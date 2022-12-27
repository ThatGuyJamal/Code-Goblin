import { Schema, model, type Model } from 'mongoose';

export type CooldownActions = 'command' | 'plugin';

export interface Cooldowns {
	_id: string;
	expires: Date;
}

const GCooldownSchema = new Schema<Cooldowns>({
	// guild_id-user_id-command_name
	_id: { type: String, required: true },
	expires: { type: Date, required: true }
});

export const CooldownModel: Model<Cooldowns> = model('cooldowns', GCooldownSchema);
