# `Code Goblin Rest`

The Code Goblin API is a Restful API that provides access to the Code Goblins core discord bot information. It is written in [Typescript](https://www.typescriptlang.org/) and uses the [AdonisJs](https://adonisjs.com/) framework.

The API main goal is to take load off of the bot and provide a more stable way to access information from the discord API. This will also help us with sharding in the future. Instead of having to make a request to each shard, the shards will just make a request to the API.

# Endpoints

### GET `/api/v1/credits`

Returns a array of all the endpoints.

_Example return data:_

```json
{
  "message": "Welcome to CodeGoblin's REST API!",
  "github": "https://github.com/ThatGuyJamal/Code-Goblin",
  "routes": ["/api/v1/guilds", "/api/v1/guilds/:id", "/api/v1/guilds/:id/channels"],
  "supportServer": "https://discord.gg/invite/MSTrBrNaGn"
}
```

### GET `/api/v1/health`

Returns a JSON object with information about the API.

_Return Json example:_

```json
{
  "success": true,
  "data": {
    "restHealth": "OK",
    "databaseHealth": "OK",
    "discordHealth": "OK"
  }
}
```

## Guilds Endpoints

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

### GET `/api/v1/guilds/:id/roles`

Returns a JSON array of roles in the guild with the given ID.

_Example return data:_

```json
{
  "success": true,
  "data": [
    {
      "id": "991449362246934648",
      "name": "@everyone",
      "color": 0,
      "position": 0,
      "hoist": false,
      "mentionable": false,
      "permissions": {
        "allow": "277025458177",
        "deny": "0"
      }
    },
    {
      "id": "992576058014576660",
      "name": "Booster",
      "color": 16271828,
      "position": 5,
      "hoist": true,
      "mentionable": false,
      "permissions": {
        "allow": "687265333825",
        "deny": "0"
      }
    }
  ]
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

## Members Endpoints

### GET `/api/v1/guilds/:id/members`

Returns a JSON array of members in the guild with the given ID.

_Example return data:_

```json
{
  "success": true,
  "data": [
    {
      "id": "961161221430734908",
      "username": "user1",
      "discriminator": "5846",
      "avatar": "https://cdn.discordapp.com/avatars/961161221430734908/7d974cf32b2b9fb991eda169650a13f7.png?size=4096",
      "bot": false,
      "system": false,
      "flags": 0,
      "premiumSince": null,
      "publicFlags": 0
    },
    {
      "id": "558350798392786994",
      "username": "user2",
      "discriminator": "8559",
      "avatar": "https://cdn.discordapp.com/avatars/558350798392786994/05a7a2879c23f5d9a212f98ec7cdba8d.png?size=4096",
      "bot": false,
      "system": false,
      "flags": 0,
      "premiumSince": null,
      "publicFlags": 4194368
    }
  ]
}
```

### GET `/api/v1/guilds/:id/members/:memberId`

Returns a JSON object with information about the member with the given ID in the guild with the given ID.

_Example return data:_

```json
{
  "id": "370637638820036608",
  "username": "ThatGuyJamal",
  "discriminator": "2695",
  "avatar": "https://cdn.discordapp.com/embed/avatars/0.png?size=4096",
  "bot": false,
  "system": false,
  "flags": 0,
  "premiumSince": null,
  "publicFlags": 4194432,
   "roles": [
    "1006242953255206952",
    "1055659568417484851"
  ]
        },
```

### GET `/api/v1/guilds/:id/members/:memberId/roles`

Returns a JSON array of roles the member with the given ID has in the guild with the given ID.

_Example return data:_

```json
{
  "success": true,
  "data": ["1006242953255206952", "1055659568417484851"]
}
```

## Channels Endpoints

### GET `/api/v1/guilds/:id/channels/:channelId`

Returns a JSON object with information about the channel with the given ID in the guild with the given ID.

_Example return data:_

```json
{
  "success": true,
  "data": {
    "id": "954186847347687435",
    "name": "News",
    "type": 4,
    "position": 0,
    "parent": null
  }
}
```

### GET `/api/v1/guilds/:id/channels/:channelId/messages`

Returns a JSON array of messages in the channel with the given ID in the guild with the given ID.

_Example return data:_

```json
{}
```
