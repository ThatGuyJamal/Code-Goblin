import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { discord } from 'App/Discord/Client'
import { ChannelTypes } from 'oceanic.js'

/**
 * Channels return type for routes
 */
type Channels = {
  id: string
  name: string
  type: ChannelTypes
  position: number
  parent: string | null
}

type Channel = {
  id: string
  name: string
  type: ChannelTypes
  position: number
  parent: string | null
}

export default class GuildChannelsController {
  /**
   * Handles the /guilds/:id/channels route
   *
   * /api/v1/guilds/:id/channels - Returns all channels for a guild
   *
   * /api/v1/guilds/:id/channels/:channelId - Returns a specific channel for a guild
   *
   * @param ctx
   * @returns
   */
  public async index(ctx: HttpContextContract) {
    if (ctx.params.channelId) {
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
        data: {
          id: channel.id,
          name: channel.name,
          type: channel.type,
          position: channel.position,
          parent: channel.parentID ?? null,
        } as Channel,
      })
    }

    const guild = discord.guilds.get(ctx.params.id)

    if (!guild) {
      return ctx.response.status(200).send({
        success: false,
        data: null,
      })
    }

    const channels: Channels[] = guild.channels.map((channel) => {
      return {
        id: channel.id,
        name: channel.name,
        type: channel.type,
        position: channel.position,
        parent: channel.parentID ?? null,
      }
    })

    if (channels.length === 0) {
      return ctx.response.status(200).send({
        success: false,
        data: null,
      })
    }

    return ctx.response.status(200).send({
      success: true,
      data: channels,
    })
  }
}
