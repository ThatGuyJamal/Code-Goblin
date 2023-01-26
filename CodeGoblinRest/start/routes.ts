/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { discord } from 'App/Discord/Client'

Route.get('/', async () => {
  return { hello: 'world!' }
})

Route.group(() => {

  // Handles requests for all guilds the bot has cached
  Route.get('/guilds', async function ({ response }) {
    let result: Guilds[] = []

    for (const guild of discord.guilds.values()) {
      result.push({
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL('png') ?? null,
        ownerId: guild.ownerID,
        memberCount: guild.memberCount,
      })
    }

    if (result.length === 0) {
      return response.status(404).send({
        success: false,
        data: null,
      })
    }

    return response.status(200).send({
      success: true,
      data: result,
    })
  })

  // Handles requests for a specific guild
  Route.get('/guilds/:id', async function ({ params, response }) {
    const guild = discord.guilds.get(params.id)

    if (!guild) {
      return response.status(404).send({
        success: false,
        data: null,
      })
    }

    return response.status(200).send({
      success: true,
      data: {
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL('png') ?? null,
        ownerId: guild.ownerID,
        memberCount: guild.memberCount,
      } as Guilds,
    })
  })
}).prefix('/api/v1')

/**
 * Guilds return type for routes
 */
type Guilds = {
  id: string
  name: string
  icon: string | null
  ownerId: string
  memberCount: number
}