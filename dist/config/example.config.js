export const isCanary = false;
export default {
    MongoDbUri: isCanary ? '' : '',
    BotToken: isCanary ? '' : '',
    BotClientId: '1055671501870874634',
    BotClientOAuth2Url: isCanary
        ? ''
        : 'https://discord.com/api/oauth2/authorize?client_id=1055671501870874634&permissions=2684700800&scope=bot%20applications.commands',
    BotName: 'Whisper Room',
    GithubRepository: 'https://github.com/whisper-room-dev',
    GithubContributionUrl: 'https://github.com/whisper-room-dev/.github/blob/main/contributing.md',
    DevelopmentServerId: isCanary
        ? ['']
        : [
            // Whisper Room Dev
            '991449362246934648'
        ],
    DevelopmentServerInviteUrl: 'https://discord.gg/MSTrBrNaGn',
    IsInDevelopmentMode: true,
    BotPrefix: 'wr!',
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
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2V4YW1wbGUuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFFOUIsZUFBZTtJQUNkLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUM5QixRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDNUIsV0FBVyxFQUFFLHFCQUFxQjtJQUNsQyxrQkFBa0IsRUFBRSxRQUFRO1FBQzNCLENBQUMsQ0FBQyxFQUFFO1FBQ0osQ0FBQyxDQUFDLGlJQUFpSTtJQUNwSSxPQUFPLEVBQUUsY0FBYztJQUN2QixnQkFBZ0IsRUFBRSxxQ0FBcUM7SUFDdkQscUJBQXFCLEVBQUUsdUVBQXVFO0lBQzlGLG1CQUFtQixFQUFFLFFBQVE7UUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ04sQ0FBQyxDQUFDO1lBQ0EsbUJBQW1CO1lBQ25CLG9CQUFvQjtTQUNuQjtJQUNKLDBCQUEwQixFQUFFLCtCQUErQjtJQUMzRCxtQkFBbUIsRUFBRSxJQUFJO0lBQ3pCLFNBQVMsRUFBRSxLQUFLO0lBQ2hCLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7SUFDekQsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtJQUMzRCxVQUFVLEVBQUU7UUFDWCxlQUFlO1FBQ2Ysb0JBQW9CO0tBQ3BCO0lBQ0QsV0FBVyxFQUFFLEVBQUU7SUFDZixZQUFZLEVBQUU7UUFDYixHQUFHLEVBQUUsd0JBQXdCO1FBQzdCLFVBQVUsRUFBRSxzQ0FBc0M7S0FDbEQ7SUFDRCxpQkFBaUIsRUFBRTtRQUNsQixNQUFNLEVBQUU7WUFDUCxLQUFLLEVBQUUsSUFBSTtZQUNYLE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxNQUFNLEVBQUU7WUFDUCxLQUFLLEVBQUUsSUFBSTtZQUNYLE1BQU0sRUFBRSxLQUFLO1NBQ2I7S0FDRDtDQUNELENBQUMifQ==