import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { discord } from 'App/Discord/Client'

/**
 * Guilds return type for routes
 */
type Guilds = {
  id: string
  name: string
  icon: string | null
  ownerId: string
  memberCount: number
  channels: string[]
  roles: string[]
}

export default class GuildsController {
  public async index(ctx: HttpContextContract) {
    // If the request has an ID parameter, return the guild with that ID
    // Otherwise, return all guilds
    if (ctx.params.id) {
      const guild = discord.guilds.get(ctx.params.id)

      if (!guild) {
        return ctx.response.status(404).send({
          success: false,
          data: null,
        })
      }

      let chs = guild.channels.map((channel) => channel.id)
      let rls = guild.roles.map((role) => role.id)

      return ctx.response.status(200).send({
        success: true,
        data: {
          id: guild.id,
          name: guild.name,
          icon: guild.iconURL('png') ?? null,
          ownerId: guild.ownerID,
          memberCount: guild.memberCount,
          channels: chs,
          roles: rls,
        } as Guilds,
      })
    }

    let result: Guilds[] = []

    for (const guild of discord.guilds.values()) {
      let chs = guild.channels.map((channel) => channel.id)
      let rls = guild.roles.map((role) => role.id)

      result.push({
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL('png') ?? null,
        ownerId: guild.ownerID,
        memberCount: guild.memberCount,
        channels: chs,
        roles: rls,
      })
    }

    if (result.length === 0) {
      return ctx.response.status(404).send({
        success: false,
        data: null,
      })
    }

    return ctx.response.status(200).send({
      success: true,
      data: result,
    })
  }
}
