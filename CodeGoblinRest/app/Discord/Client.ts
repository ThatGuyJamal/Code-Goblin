import { Client } from 'oceanic.js'
import config from '../config.json'

class DiscordClient extends Client {
  private _allowedToConnect: boolean
  public constructor() {
    super({
      auth: `Bot ${process.env.BOT_TOKEN}`,
      gateway: {
        intents: ['ALL'],
      },
    })

    this.on('ready', () => {
      console.log('Discord client ready')
    })

    this._allowedToConnect = config.discordConnectionAllowed
    this._init()
  }

  private _init(): void {
    const allowedToConnect = this._allowedToConnect

    if (!allowedToConnect) {
      console.warn('Discord Client Not Allowed To Connect')
      return
    }

    this.connect()
  }
}

export const discord = new DiscordClient()
