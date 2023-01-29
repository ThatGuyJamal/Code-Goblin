import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { discord } from 'App/Discord/Client'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import mongoose from 'mongoose'

export default class HealthController {
  /**
   * Handles the health check
   *
   * /api/v1/health
   *
   * @param ctx
   * @returns
   */
  public async index(ctx: HttpContextContract) {
    const report = await HealthCheck.getReport()

    return ctx.response.status(200).send({
      success: true,
      data: {
        restHealth: report.healthy ? 'OK' : 'NOT OK',
        databaseHealth: mongoose.connection.readyState === 1 ? 'OK' : 'NOT OK',
        discordHealth: discord.alive ? 'OK' : 'NOT OK',
      },
    })
  }
}
