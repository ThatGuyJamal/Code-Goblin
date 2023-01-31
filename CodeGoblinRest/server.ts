/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'
import Logger from '@ioc:Adonis/Core/Logger'

sourceMapSupport.install({ handleUncaughtExceptions: true })

new Ignitor(__dirname).httpServer().start()

process
  .on('unhandledRejection', (err, promise) => {
    Logger.error('Unhandled Rejection:', err, promise)
  })
  .on('uncaughtException', (err) => {
    Logger.error('Uncaught Exception:', err)
  })
  .on('uncaughtExceptionMonitor', (err, origin) => {
    Logger.error('Uncaught Exception Monitor:', err, origin)
  })
