import type { ConnectionStates } from 'mongoose';

export interface NetworkStatusReturnTypes {
	connected: boolean;
	status: ConnectionStates;
}

export enum TagLimits {
	MAX_CREATED_TAGS = 10
}

// Type def for the tag model
export interface TagSchema {
	guild_id: string;
	// The name of the tag
	name: string;
	// The data to display when the tag is called
	content: string;
	created_by_name: string;
	created_by_id: string;
	created_at: Date;
	updated_at: Date | null; // null if never updated
}

// Type def for the tag model
export interface CodeJamSchema {
	guild_id: string;

	// The name of the code jam
	name: string;
	// The description of the code jam
	description: string;
	// The role given to participants of the code jam
	event_role_id: string | null;
	event_managers_role_id: string | null;
	// A list of users who are participating in the code jam
	event_participants_ids: string[] | null;
	// A list of users who are managing the code jam
	event_managers_ids: string[] | null;
	// The channel where the code jam is being hosted
	event_channel: string | null;

	event_image_url: string | null;
	entityType: string | null;

	event_scheduled_start_time: String;
	event_scheduled_end_time: String;

	created_by_name: string;
	created_by_id: string;
	created_at: Date;
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
