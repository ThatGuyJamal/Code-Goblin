import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApiKeysModel } from 'App/models/ApiKeys'

/**
 * Auth middleware
 * This checks if the user is authenticated before allowing them to access the route.
 *
 * Good:
 * Example: http://localhost:3333/api/v1/guilds?username=test&password=test
 *
 * Bad:
 * Example: http://localhost:3333/api/v1/guilds
 */
export default class Auth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // We grab the api_key from the query string
    const apiKey: string = request.qs().api_key

    let validKey = await ApiKeysModel.checkIfKeyExists(apiKey)

    if (!validKey) {
      return response.unauthorized({
        message: 'Unauthorized Access!',
      })
    }

    await next()
  }
}
