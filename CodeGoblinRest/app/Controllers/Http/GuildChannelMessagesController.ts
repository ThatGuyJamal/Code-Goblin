import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { discord } from 'App/Discord/Client'

export default class GuildChannelMessagesController {
  public async index(ctx: HttpContextContract) {
    const guild = discord.guilds.get(ctx.params.id)

    if (!guild) {
      return ctx.response.status(200).send({
        success: false,
        data: null,
      })
    }

    const channel = guild.channels.get(ctx.params.channelId)

    if (!channel) {
      return ctx.response.status(200).send({
        success: false,
        data: null,
      })
    }

    return ctx.response.status(200).send({
      success: true,
      data: 'todo',
    })
  }
}
