import { Client } from 'oceanic.js'

class DiscordClient extends Client {
  public constructor() {
    super({
      auth: `Bot ${process.env.BOT_TOKEN}`,
      gateway: {
        intents: ['ALL'],
      },
    })

    // this.connect()
    console.log("Discord client connected")
  }
}

export const discord = new DiscordClient()