import { Listener } from '@sapphire/framework';
import { ActivityType, Client } from 'discord.js';

export class ReadyListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            once: true,
            event: 'ready'
        });
    }
    public run(client: Client) {

        client.user?.setPresence({
            activities: [
                {
                    name: "with Chat-GTP 4",
                    type: ActivityType.Playing
                }
            ]
        })

        const { username, id } = client.user!;
        this.container.logger.info(`Successfully logged in as ${username} (${id})`);
    }
}