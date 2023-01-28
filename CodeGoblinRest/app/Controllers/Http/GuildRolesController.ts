import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { discord } from 'App/Discord/Client'
import Permission from 'oceanic.js/dist/lib/structures/Permission'

type Roles = {
  id: string
  name: string
  color: number
  position: number
  hoist: boolean
  mentionable: boolean
  permissions: Permission
}

export default class GuildRolesController {
  /**
   * Gets all roles from a guild
   *
   * /api/guilds/:id/roles - Returns all roles for a guild
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

    const roles: Roles[] = guild.roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
        color: role.color,
        position: role.position,
        hoist: role.hoist,
        mentionable: role.mentionable,
        permissions: role.permissions,
      }
    })

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
