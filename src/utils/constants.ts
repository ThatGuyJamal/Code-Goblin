export default {
	strings: {
		not_implemented: 'This function is not implemented yet.',
		events: {
			interactionProcess: {
				premiumOnly: `This command can only be used by premium users.`,
				helpersOnly: `This command can only be used by helper users.`,
				superUsersOnly: `This command can only be used by super users.`,
				commandDisabled: `This command is currently disabled.`,
				botPermissions: `I do not have the required permissions to run this command.`,
				userPermissions: `You do not have the required permissions to run this command.`
			}
		}
	},
	numbers: {
		// Used in embeds
		colors: {
			primary: 0x0e5519,
			secondary: 0x0e553d,
			tertiary: 0x0e4a55
		}
	}
};

/**
 * A collection of all the milliseconds in a year
 */
export enum Milliseconds {
	SECOND = 1000,
	MINUTE = 60 * SECOND,
	HOUR = 60 * MINUTE,
	DAY = 24 * HOUR,
	WEEK = 7 * DAY,
	MONTH = 30 * DAY,
	YEAR = 365 * DAY
}