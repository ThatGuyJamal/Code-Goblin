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
        members: 20_000,
        messages: 10_000,
        users: 1_000
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
        guildCreateTimeout: 2000,
        intents: ['GUILDS', 'GUILD_MEMBERS', 'MESSAGE_CONTENT', 'GUILD_MESSAGES'],
        largeThreshold: 250,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbkQsT0FBTyxNQUFNLE1BQU0sb0JBQW9CLENBQUM7QUFDeEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzdELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFN0Q7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQ2hDLElBQUksRUFBRSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUU7SUFDOUIsZ0JBQWdCLEVBQUU7UUFDakIsT0FBTyxFQUFFLE1BQU07UUFDZixRQUFRLEVBQUUsTUFBTTtRQUNoQixLQUFLLEVBQUUsS0FBSztLQUNaO0lBQ0QsZUFBZSxFQUFFO1FBQ2hCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsV0FBVyxFQUFFLElBQUk7UUFDakIsS0FBSyxFQUFFLElBQUk7UUFDWCxLQUFLLEVBQUUsSUFBSTtLQUNYO0lBQ0Qsa0JBQWtCLEVBQUUsS0FBSztJQUN6QixnQkFBZ0IsRUFBRSxJQUFJO0lBQ3RCLE9BQU8sRUFBRTtRQUNSLGFBQWEsRUFBRSxJQUFJO1FBQ25CLFdBQVcsRUFBRSxDQUFDO1FBQ2Qsb0JBQW9CLEVBQUU7WUFDckIsT0FBTyxFQUFFLFNBQVM7WUFDbEIsTUFBTSxFQUFFLFNBQVM7WUFDakIsRUFBRSxFQUFFLFNBQVM7U0FDYjtRQUNELGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsWUFBWSxFQUFFLENBQUM7UUFDZixXQUFXLEVBQUUsS0FBSztRQUNsQixrQkFBa0IsRUFBRSxJQUFJO1FBQ3hCLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLENBQUM7UUFDekUsY0FBYyxFQUFFLEdBQUc7UUFDbkIsb0JBQW9CLEVBQUUsUUFBUTtRQUM5QixpQkFBaUIsRUFBRSxFQUFFO1FBQ3JCLFNBQVMsRUFBRSxDQUFDO1FBQ1osUUFBUSxFQUFFO1lBQ1QsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztZQUN0RSxNQUFNLEVBQUUsUUFBUTtTQUNoQjtRQUNELG9CQUFvQixFQUFFLEtBQUs7S0FDM0I7Q0FDRCxDQUFDLENBQUM7QUFFSCwrQ0FBK0M7QUFDL0MsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHO0lBQ3JCLGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUU7SUFDckMsUUFBUSxFQUFFO1FBQ1QsR0FBRyxFQUFFLFFBQVE7UUFDYixPQUFPLEVBQUUsWUFBWTtRQUNyQixPQUFPLEVBQUUsWUFBWTtLQUNyQjtDQUNELENBQUM7QUFFRixNQUFNLFVBQVUsYUFBYTtJQUM1QixPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQztBQUM3QyxDQUFDIn0=