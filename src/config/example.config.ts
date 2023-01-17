export const isCanary = false;

export default {
	MongoDbUri: isCanary ? '' : '',
	BotToken: isCanary ? '' : '',
	BotClientId: '1055671501870874634',
	BotClientOAuth2Url:
		'https://discord.com/api/oauth2/authorize?client_id=1055671501870874634&permissions=2684700800&scope=bot%20applications.commands',
	BotName: 'Code Buddy',
	GithubRepository: 'https://github.com/whisper-room-dev',
	GithubContributionUrl: 'https://github.com/whisper-room-dev/.github/blob/main/contributing.md',
	DevelopmentServerId: isCanary
		? ['']
		: [
				// Support Server
				'991449362246934648'
		  ],
	DevelopmentServerInviteUrl: 'https://discord.gg/MSTrBrNaGn',
	IsInDevelopmentMode: true,
	BotApiLogChannelId: isCanary ? '' : '1056292297756639342',
	BotErrorLogChannelId: isCanary ? '' : '1056339397194297384',
	SuperUsers: [
		// ThatGuyJamal
		'370637638820036608'
	],
	HelperUsers: [],
	whisper_room: {
		url: 'http://whisperroom.net',
		bot_oauth2: 'http://whisperroom.net/go/invite_bot'
	},
	register_commands: {
		delete: {
			guild: true,
			global: false
		},
		create: {
			guild: true,
			global: false
		}
	},
	cacheDisabled: {
		tags: true,
		welcome: false,
		goodbye: false
	}
};
