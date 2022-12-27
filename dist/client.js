import mongoose from 'mongoose';
import { ActivityTypes, Client } from 'oceanic.js';
import config from './config/config.js';
import { GoodbyeModel } from './database/schemas/goodbye.js';
import { TagModel } from './database/schemas/tags.js';
import { WelcomeModel } from './database/schemas/welcome.js';
/**
 * The Client Object for the bot by Oceanic.js
 *
 * This will not be mutated by us, and will only contain all native methods and properties from Oceanic.js
 *
 * The main manager class for the bot is found in Main.js and is called MainInstance.
 */
export const client = new Client({
    auth: `Bot ${config.BotToken}`,
    collectionLimits: {
        members: 1_000,
        messages: 0,
        users: 5_000
    },
    allowedMentions: {
        everyone: false,
        repliedUser: true,
        roles: true,
        users: true
    },
    defaultImageFormat: 'png',
    defaultImageSize: 4096,
    gateway: {
        autoReconnect: true,
        concurrency: 1,
        connectionProperties: {
            browser: 'Oceanic',
            device: 'Oceanic',
            os: 'Android'
        },
        connectionTimeout: 30000,
        firstShardID: 0,
        getAllUsers: false,
        guildCreateTimeout: 5000,
        intents: ['GUILDS', 'GUILD_MEMBERS', 'MESSAGE_CONTENT', 'GUILD_MESSAGES'],
        largeThreshold: 1000,
        maxReconnectAttempts: Infinity,
        maxResumeAttempts: 10,
        maxShards: 1,
        presence: {
            activities: [{ type: ActivityTypes.WATCHING, name: 'The Chat Rooms' }],
            status: 'online'
        },
        seedVoiceConnections: false
    }
});
/** The data for the MainInstance DB object. */
export const db_obj = {
    network_status: () => fetchDBStatus(),
    managers: {
        tag: TagModel,
        welcome: WelcomeModel,
        goodbye: GoodbyeModel
    }
};
export function fetchDBStatus() {
    return mongoose.connection.readyState === 1;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbkQsT0FBTyxNQUFNLE1BQU0sb0JBQW9CLENBQUM7QUFDeEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzdELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFN0Q7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQ2hDLElBQUksRUFBRSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUU7SUFDOUIsZ0JBQWdCLEVBQUU7UUFDakIsT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsQ0FBQztRQUNYLEtBQUssRUFBRSxLQUFLO0tBQ1o7SUFDRCxlQUFlLEVBQUU7UUFDaEIsUUFBUSxFQUFFLEtBQUs7UUFDZixXQUFXLEVBQUUsSUFBSTtRQUNqQixLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxJQUFJO0tBQ1g7SUFDRCxrQkFBa0IsRUFBRSxLQUFLO0lBQ3pCLGdCQUFnQixFQUFFLElBQUk7SUFDdEIsT0FBTyxFQUFFO1FBQ1IsYUFBYSxFQUFFLElBQUk7UUFDbkIsV0FBVyxFQUFFLENBQUM7UUFDZCxvQkFBb0IsRUFBRTtZQUNyQixPQUFPLEVBQUUsU0FBUztZQUNsQixNQUFNLEVBQUUsU0FBUztZQUNqQixFQUFFLEVBQUUsU0FBUztTQUNiO1FBQ0QsaUJBQWlCLEVBQUUsS0FBSztRQUN4QixZQUFZLEVBQUUsQ0FBQztRQUNmLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLGtCQUFrQixFQUFFLElBQUk7UUFDeEIsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsQ0FBQztRQUN6RSxjQUFjLEVBQUUsSUFBSTtRQUNwQixvQkFBb0IsRUFBRSxRQUFRO1FBQzlCLGlCQUFpQixFQUFFLEVBQUU7UUFDckIsU0FBUyxFQUFFLENBQUM7UUFDWixRQUFRLEVBQUU7WUFDVCxVQUFVLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3RFLE1BQU0sRUFBRSxRQUFRO1NBQ2hCO1FBQ0Qsb0JBQW9CLEVBQUUsS0FBSztLQUMzQjtDQUNELENBQUMsQ0FBQztBQUVILCtDQUErQztBQUMvQyxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUc7SUFDckIsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWEsRUFBRTtJQUNyQyxRQUFRLEVBQUU7UUFDVCxHQUFHLEVBQUUsUUFBUTtRQUNiLE9BQU8sRUFBRSxZQUFZO1FBQ3JCLE9BQU8sRUFBRSxZQUFZO0tBQ3JCO0NBQ0QsQ0FBQztBQUVGLE1BQU0sVUFBVSxhQUFhO0lBQzVCLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDO0FBQzdDLENBQUMifQ==