<!-- - Add command ratelimits using https://github.com/sapphiredev/utilities/tree/main/packages/ratelimits. [Global, Guild, User] -->
- add https://github.com/aiko-chan-ai/Discord-Markdown (maybe)
<!-- - add https://beta.openai.com/docs/guides/images/usage -->
- add https://beta.openai.com/docs/guides/fine-tuning
- add https://github.com/sapphiredev/utilities/tree/main/packages/async-queue for open-api queue later
<!-- - might need? https://github.com/sapphiredev/utilities/tree/main/packages/fetch -->
- might need? https://github.com/sapphiredev/utilities/tree/main/packages/timer-manager
- might need? https://github.com/sapphiredev/utilities/tree/main/packages/utilities 

- Make it so caching is always enabled, but if no cache has been called in the last 30min by the collection then it will be deleted from cache we would need to make a cache manager for this and have it run every 30min. 

- Improve the ai image command. We need to send the new image to discord and use its cdn. This will save the url then send it back to users in the embed. This is because the image api used by open ai deletes the image after 1 hour where as discord's cdn will keep it forever.