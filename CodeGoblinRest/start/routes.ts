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

Route.group(() => {
  // Handles requests for the root route
  Route.get('/credits', async () => {
    return {
      message: "Welcome to CodeGoblin's REST API!",
      github: 'https://github.com/ThatGuyJamal/Code-Goblin',
      routes: [
        '/api/v1/credits',
        '/api/v1/health',
        '/api/v1/guilds',
        '/api/v1/guilds/:id',
        '/api/v1/guilds/:id/roles',
        '/api/v1/guilds/:id/channels',
        '/api/v1/guilds/:id/channels/:channelId',
        '/api/v1/guilds/:id/channels/:channelId/messages', // todo
        '/api/v1/guilds/:id/members',
        '/api/v1/guilds/:id/members/:memberId',
        '/api/v1/guilds/:id/members/:memberId/roles',
      ],
      supportServer: 'https://discord.gg/invite/MSTrBrNaGn',
    }
  })

  // Handles requests for the health route
  Route.get('/health', 'HealthController.index')

  // Handles requests for guilds
  Route.get('/guilds/:id?', 'GuildsController.index')

  // Handles requests for a specific guild's channels
  Route.get('/guilds/:id/channels/:channelId?', 'GuildChannelsController.index')

  // Handles requests for a specific guild's channel's messages
  Route.get('/guilds/:id/channels/:channelId/messages', 'GuildChannelMessagesController.index')

  // Handles requests for a specific guild's roles
  Route.get('/guilds/:id/roles', 'GuildRolesController.index')

  // Handles requests for guild members
  Route.get('/guilds/:id/members/:memberId?', 'GuildMembersController.index')

  // Handles requests for a specific guild member's roles
  Route.get('/guilds/:id/members/:memberId/roles', 'GuildMembersRolesController.index')
}).prefix('/api/v1')
