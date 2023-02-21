<!-- - Add command ratelimits using https://github.com/sapphiredev/utilities/tree/main/packages/ratelimits. [Global, Guild, User] -->

- add https://github.com/aiko-chan-ai/Discord-Markdown (maybe)

<!-- - add https://beta.openai.com/docs/guides/images/usage -->

- add https://beta.openai.com/docs/guides/fine-tuning
- add https://github.com/sapphiredev/utilities/tree/main/packages/async-queue for open-api queue later

<!-- - might need? https://github.com/sapphiredev/utilities/tree/main/packages/fetch -->

- might need? https://github.com/sapphiredev/utilities/tree/main/packages/timer-manager
- might need? https://github.com/sapphiredev/utilities/tree/main/packages/utilities

- Make it so caching is always enabled, but if no cache has been called in the last 30min by the collection then it will
  be deleted from cache we would need to make a cache manager for this and have it run every 30min.

- create a function that checks daily if a premium users activation has expired and if it has then it will remove the
  premium account from the user.

- Feature were commands can be enabled or disabled by server admins in channels or globally (server). This will need to
  be cached.

- reputation set/remove command for server managers (Have a warning with a button to confirm)

- reputation clear command for admins

- chnage welcome and goodbye plugin enable/disable to server config data

- add rank-up role rewards for servers

- add event when forms and threads are created, bot joins if reputation plugin is enabled. This allows us to track the rep messages from these 
channels as well.