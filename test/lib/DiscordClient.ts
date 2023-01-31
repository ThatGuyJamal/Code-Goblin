import { Client } from 'oceanic.js'
import type { RestConfig } from './RestClient'

export class DiscordClient extends Client {
  public alive: boolean
  private config: RestConfig
  public constructor(c: RestConfig) {
    super({
					auth: `Bot ${c.discordBotToken}`,
					collectionLimits: {
						members: Infinity,
						messages: 100,
						users: Infinity,
					},
					gateway: {
						autoReconnect: true,
						getAllUsers: false,
						guildCreateTimeout: 5000,
						connectionProperties: {
							browser: "Code Goblin Rest",
							device: "Code Goblin Rest",
							os: "Linux",
						},
						intents: ["ALL"],
					},
				});

    this.config = c

    this.on('error', (error) => {
      if (typeof error === 'string') {
        console.error(error)
      }
      this.alive = false
    })

    this.on('disconnect', () => {
      console.info("Discord client disconnected");
      this.alive = false
    })

    this.on('ready', () => {
      console.info("Discord client ready!");
      this.alive = true
    })

    this._init()
  }

  private _init(): void {
    const allowedToConnect = this.config.discordConnectToGateway

    if (allowedToConnect === 'allowed' && !this.alive) this.connect()
  }

  public get clientId(): string {
    return this.clientId
  }
}