# Code Goblin

A programmers best friend.

## `Quick Links`

*   [Discord Server](https://discord.gg/MSTrBrNaGn)

*   [Invite Bot](https://discord.com/api/oauth2/authorize?client_id=1055671501870874634\&permissions=148981992464\&scope=applications.commands%20bot)

## `Commands`

| Name            | Sub-commands                                                                                                                                                              | Access Level        |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------ |
| Automate        | welcome/goodbye \[create, view, delete],simulate                                                                                                                          | Server Managers     |
| commands        | None                                                                                                                                                                      | Everyone            |
| Embed Generator | None                                                                                                                                                                      | Server Managers     |
| Imagine         | None                                                                                                                                                                      | Premium Users       |
| Info            | None                                                                                                                                                                      | Everyone            |
| Ping            | None                                                                                                                                                                      | Everyone            |
| Reputation      | view, leaderboard                                                                                                                                                         | Everyone            |
| Configure       | language, view, clear, reputation-status, reputation-gains, reputation-channel, reputation-message-status, reputation-message-content, reputation-give, reputation-remove | Server Managers     |
| Tag             | create, edit, delete, search, clear                                                                                                                                       | Everyone/Moderators |

## `Premium Commands`

These commands are only available to premium users. The main reason is because these commands require a lot of resources to run. If you would like to support the bot, please consider becoming a premium user.

*   [x] `imagine <prompt>` Generate an image from a prompt.

*   [ ] `code <language> <code>` Generate code completions from text.

## `API`

Code Goblins API is currently in development. If you would like to contribute to the project, please contact me on Discord. For now you can find the code [here](./CodeGoblinRest/README.md)

## `Contributing`

`Code Goblin` is an open source bot dedicated to helping programmers make learning easier within discord. We are always looking for support in the form of code contributions, bug reports, and feature requests. If you would like to contribute to the project, please clone the repository and submit a pull request.

## `Self Hosting`

A detailed guide will be written later but for now read below:

### `.env`

The bot's main functions come from its database [mongodb](./CodeGoblinBot/src/database/mongodb/) and API's [OpenAI](./CodeGoblinBot/src/openai/) which require special keys for authorization.

First create a file called `.env` in source dir of [CodeGoblinBot](./CodeGoblinBot/) (not the src folder).

Then paste fill out this data:

```cpp
# Production values
DISCORD_BOT_TOKEN=
DISCORD_BOT_PREFIX=!
MONGODB_URI=

DISCORD_OPENAI_API_KEY=

# Development Values
DISCORD_BOT_TOKEN_DEV=
DISCORD_BOT_DEV_GUILD=
MONGODB_URI_DEV=
```

### `config.ts`

After go to the [config.ts](./CodeGoblinBot/src/config.ts) file and fill exit the current data. This file loads/validates the data from the `.env` file and makes it available to the rest of the project.
