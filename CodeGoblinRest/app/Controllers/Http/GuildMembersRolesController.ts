import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { discord } from 'App/Discord/Client'

export default class GuildMembersRolesController {
  /**
   * Handles the guild members roles
   *
   * /api/v1/guilds/:id/members/:memberId/roles
   *
   * @param ctx
   * @returns
   */
  public async index(ctx: HttpContextContract) {
    const guild = discord.guilds.get(ctx.params.id)

    if (!guild) {
      return ctx.response.status(200).send({
        success: false,
        data: null,
      })
    }

    const member = guild?.members.get(ctx.params.memberId)

    if (!member) {
      return ctx.response.status(200).send({
        success: false,
        data: null,
      })
    }

    const roles = member.roles.map((id) => id)

    if (roles.length === 0) {
      return ctx.response.status(200).send({
        success: false,
        data: null,
      })
    }

    return ctx.response.status(200).send({
      success: true,
      data: roles,
    })
  }
}
