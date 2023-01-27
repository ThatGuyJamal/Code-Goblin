# `Code Goblin Rest`

The Code Goblin API is a Restful API that provides access to the Code Goblins core discord bot information. It is written in [Typescript](https://www.typescriptlang.org/) and uses the [AdonisJs](https://adonisjs.com/) framework.

The API main goal is to take load off of the bot and provide a more stable way to access information from the discord API. This will also help us with sharding in the future. Instead of having to make a request to each shard, the shards will just make a request to the API.

## Endpoints

### GET `/api/v1/`

Returns a array of all the endpoints.

_Example return data:_

```json
{
  "message": "Welcome to CodeGoblin's REST API!",
  "github": "https://github.com/ThatGuyJamal/Code-Goblin",
  "routes": ["/api/v1/guilds", "/api/v1/guilds/:id", "/api/v1/guilds/:id/channels"]
}
```

### GET `/api/v1/guilds`

Returns a JSON array of guilds that the bot is in.

_Example return data:_

```json
{
  "success": true,
  "data": [
    {
      "id": "954186846504648706",
      "name": "Typescript's server",
      "icon": null,
      "ownerId": "954147463600701510",
      "memberCount": 5,
      "channels": ["954186847347687435", "954186847347687436", "1037173913609830400"],
      "roles": ["954186846504648706", "1014639441186390079", "1014926353151295571"]
    },
    {
      "id": "991449362246934648",
      "name": "Code Goblin (Support Server)",
      "icon": "https://cdn.discordapp.com/icons/991449362246934648/9e829c3639d3fbcf53a814051fd04054.png?size=4096",
      "ownerId": "370637638820036608",
      "memberCount": 103,
      "channels": [
        "1006238327923539969",
        "1006242001215311973",
        "1006242588535296062",
        "1067226341658861658",
        "1067999758444142652"
      ],
      "roles": [
        "991449362246934648",
        "992576058014576660",
        "1006015963092766781",
        "1065431708985470996",
        "1065696197882433598"
      ]
    }
  ]
}
```

### GET `/api/v1/guilds/:id`

Returns a JSON object with information about the guild with the given ID.

_Example return data:_

```json
{
  "success": true,
  "data": {
    "id": "954927346504648706",
    "name": "Example Json Guild",
    "icon": null,
    "ownerId": "954147463430702210",
    "memberCount": 5,
    "channels": ["954186847347687435", "954186847347687436", "1037173913609830400"],
    "roles": ["954186846504648706", "1014926353151295571"]
  }
}
```

### GET `/api/v1/guilds/:id/channels`

Returns a JSON array of channels in the guild with the given ID.

_Example return data:_

```json
{
  "success": true,
  "data": [
    {
      "id": "95410293847347687435",
      "name": "Text Channels",
      "type": 4,
      "position": 0,
      "parent": null
    },
    {
      "id": "954183437347687438",
      "name": "General",
      "type": 2,
      "position": 0,
      "parent": "95418683347687436"
    },
    {
      "id": "1037173913609830400",
      "name": "links",
      "type": 0,
      "position": 2,
      "parent": "9541868232347687435"
    }
  ]
}
```
