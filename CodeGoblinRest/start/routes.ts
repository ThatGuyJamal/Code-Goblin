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
  Route.get('/', async () => {
    return {
      message: "Welcome to CodeGoblin's REST API!",
      github: 'https://github.com/ThatGuyJamal/Code-Goblin',
      routes: ['/api/v1/guilds', '/api/v1/guilds/:id', '/api/v1/guilds/:id/channels'],
      supportServer: 'https://discord.gg/invite/MSTrBrNaGn',
    }
  })

  // Handles requests for guilds
  Route.get('/guilds/:id?', 'GuildsController.index')

  // Handles requests for a specific guild's channels
  Route.get('/guilds/:id/channels', 'GuildChannelsController.index')
}).prefix('/api/v1')
