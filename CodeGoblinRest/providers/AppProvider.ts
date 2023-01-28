import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { discord } from 'App/Discord/Client'
import mongoose from 'mongoose'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
    mongoose
      .connect(process.env.MONGODB_URL ?? 'mongodb://localhost:27017/db')
      .then(() => {
        console.info('Connected to Mongodb!')
      })
      .catch((err) => {
        console.error(`Error connecting to the database: ${err}`)
      })
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
    discord.disconnect()
    await mongoose.connection.close()
  }
}
