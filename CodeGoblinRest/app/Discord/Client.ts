import { Client } from 'oceanic.js'
import Logger from '@ioc:Adonis/Core/Logger'

class DiscordClient extends Client {
  public alive: boolean
  public constructor() {
    super({
      auth: `Bot ${process.env.BOT_TOKEN}`,
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
          browser: 'Code Goblin Rest',
          device: 'Code Goblin Rest',
          os: 'Linux',
        },
        intents: ['ALL'],
      },
    })

    this.on('error', (error) => {
      if (typeof error === 'string') {
        Logger.error(error)
      }
      this.alive = false
    })

    this.on('disconnect', () => {
      Logger.info('Discord client disconnected')
      this.alive = false
    })

    this.on('ready', () => {
      Logger.info('Discord client ready!')
      this.alive = true
    })

    this._init()
  }

  private _init(): void {
    const allowedToConnect = 'allowed'

    if (allowedToConnect === 'allowed' && !this.alive) this.connect()
  }
}

export const discord = new DiscordClient()
