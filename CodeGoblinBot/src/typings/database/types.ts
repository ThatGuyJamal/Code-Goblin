import type { ConnectionStates } from 'mongoose';

export interface NetworkStatusReturnTypes {
	connected: boolean;
	status: ConnectionStates;
}

export enum TagLimits {
	MAX_CREATED_TAGS = 10
}

export interface PremiumUserSchema {
	user_id: string;
	activated: boolean;
	activated_at: number | null;
	/** Some users can have life time access */
	expires_at: Number | null;
	level: PremiumUserLevels | null;
}

export enum PremiumUserLevels {
	LIFE_TIME = 'lifetime',
	MONTHLY = 'monthly',
	YEARLY = 'yearly'
}
