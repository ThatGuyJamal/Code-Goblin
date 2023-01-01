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
				userPermissions: `You do not have the required permissions to run this command.`,
				isOnCooldown: `You are currently on cooldown for this command.`
			}
		},
		commands: {
			info: {
				company: {
					bio: 'A place for people to talk about anything they want, without being judged. Users are anonymous, and can only see the messages of other users. The messages are deleted after a certain amount of time, so you can talk about anything you want, without worrying about it being seen by anyone else.'
				},
				bot: {
					bio: `An open source tool helpful for programmers on discord. While its main functions are support the Whisper Rooms API, it can also be used for programmers to automate their own development.`
				}
			}
		}
	},
	numbers: {
		// Used in embeds
		colors: {
			primary: 0x8b4513,
			secondary: 0xa0522d,
			tertiary: 0xd2691e
		}
	}
};
