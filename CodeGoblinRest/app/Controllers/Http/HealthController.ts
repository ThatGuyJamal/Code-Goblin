import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { discord } from 'App/Discord/Client'

export default class HealthController {
  public async index(ctx: HttpContextContract) {
    return ctx.response.status(200).send({
      success: true,
      data: {
        restHealth: 'OK',
        databaseHealth: 'OK', // todo - implement database health check
        discordHealth: discord.alive ? 'OK' : 'NOT OK',
      },
    })
  }
}
