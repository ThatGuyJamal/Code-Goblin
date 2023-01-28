import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { discord } from 'App/Discord/Client'

type Members = {
  id: string
  username: string
  discriminator: string
  avatar: string
  bot: boolean
  system: boolean
  flags: number | undefined
  premiumSince: Date | null
  publicFlags: number
  roles: string[]
}

type Member = {
  id: string
  username: string
  discriminator: string
  avatar: string
  bot: boolean
  system: boolean
  flags: number | undefined
  premiumSince: Date | null
  publicFlags: number
  roles: string[]
}

export default class GuildMembersController {
  /**
   * Handles the guild members
   *
   * /api/v1/guilds/:id/members
   * /api/v1/guilds/:id/members/:memberId
   *
   * @param ctx
   * @returns
   */
  public async index(ctx: HttpContextContract) {
    // If the member ID is provided, return the member data
    if (ctx.params.memberId) {
      const member = discord.guilds.get(ctx.params.id)?.members.get(ctx.params.memberId)

      if (!member) {
        return ctx.response.status(200).send({
          success: false,
          data: null,
        })
      }

      return ctx.response.status(200).send({
        success: true,
        data: {
          id: member.id,
          username: member.username,
          discriminator: member.discriminator,
          avatar: member.avatarURL(),
          bot: member.bot,
          system: member.system,
          flags: member.flags,
          premiumSince: member.premiumSince,
          publicFlags: member.publicFlags,
          roles: member.roles.map((id) => id) || [],
        } as Member,
      })
    }

    const guild = discord.guilds.get(ctx.params.id)

    if (!guild) {
      return ctx.response.status(200).send({
        success: false,
        data: null,
      })
    }

    const members: Members[] = guild.members.map((member) => {
      return {
        id: member.id,
        username: member.username,
        discriminator: member.discriminator,
        avatar: member.avatarURL(),
        bot: member.bot,
        system: member.system,
        flags: member.flags,
        premiumSince: member.premiumSince,
        publicFlags: member.publicFlags,
        roles: member.roles.map((id) => id) || [],
      } as Members
    })

    if (members.length === 0) {
      return ctx.response.status(200).send({
        success: false,
        data: null,
      })
    }

    return ctx.response.status(200).send({
      success: true,
      data: members,
    })
  }
}
