# `Code Goblin API`

The Code Goblin API is a Restful API that provides access to the Code Goblin database. It is written in [Java](https://en.wikipedia.org/wiki/Java_(programming_language)) and uses the [Spark](https://sparkjava.com/) framework. 

The API main goal is to take load off of the bot and provide a more stable way to access information from the discord API. This will also help us with sharding in the future. Instead of having to make a request to each shard, the shards will just make a request to the API.

## Endpoints

### GET `/`

Returns a array of all the endpoints.

```json
[
    "/api/v1/guilds",
    "/api/v1/guilds/:id"
]
```

### GET `/api/v1/guilds`

Returns a JSON array of guilds that the bot is in.

*Example return data*
```json
[
    {
        "memberCount": 3,
        "name": "Pingu",
        "id": "943700714469855332"
    },
    {
        "memberCount": 5,
        "name": "Typescript's server",
        "id": "954186846504648706"
    },
    {
        "memberCount": 103,
        "name": "Code Goblin  (Support Server)",
        "id": "991449362246934648"
    }
]
```

### GET `/api/v1/guilds/:id`

Returns a JSON object with information about the guild with the given ID.

```json
{
  "emojis": [],
  "boostersTier": "NONE",
  "memberCount": 5,
  "roles": [
    "954186846504648706",
    "1014926353151295571",
    "1014639441186390079",
    "1008201654560116768",
    "972026154762518551",
    "971829156813881408"
  ],
  "verificationLevel": "NONE",
  "widgetEnabled": false,
  "createdAt": "2022-03-18T01:17:52.141Z",
  "features": [],
  "systemChannelFlags": [],
  "channels": [
    "954186847347687435"
  ],
  "members": [
    "1004561646347374742"
  ],
  "name": "Typescript's server",
  "id": "954186846504648706",
  "boostersCount": 0,
  "region": "UNKNOWN"
}
```

