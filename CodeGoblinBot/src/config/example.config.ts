import { ActivityTypes, BotActivityTypes } from 'oceanic.js';

export const isCanary = false;

export default {
	MongoDbUri: isCanary ? '' : '',
	BotToken: isCanary ? '' : '',
	BotClientId: '1055671501870874634',
	BotClientOAuth2Url:
		'https://discord.com/api/oauth2/authorize?client_id=1055671501870874634&permissions=148981992464&scope=bot%20applications.commands',
	BotClientOAuth2UrlShort: 'http://bit.ly/3Wvqk5u',
	BotName: 'Code Goblin',
	BotPrefix: 'c!',
	BotActivityType: ActivityTypes.LISTENING as BotActivityTypes,
	BotActivityMessage: `to the console`,
	BotActivityStatus: 'online',
	GithubRepository: 'https://github.com/ThatGuyJamal/Code-Goblin',
	GithubContributionUrl: '',
	DevelopmentServerId: isCanary
		? ['']
		: [
				// Support Server
				'991449362246934648'
		  ],
	DeveloperTag: 'ThatGuyJamal#2695',
	DevelopmentServerInviteUrl: 'https://discord.gg/MSTrBrNaGn',
	IsInDevelopmentMode: true,
	BotApiLogChannelId: isCanary ? '' : '1056292297756639342',
	BotErrorLogChannelId: isCanary ? '' : '1056339397194297384',
	BotPremiumLogChannelId: isCanary ? '' : '1064732671399432202',
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
		goodbye: false,
		jam: false,
		premium_users: false
	}
};
