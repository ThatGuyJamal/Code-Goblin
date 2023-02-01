# Code Goblin Bot

Bug fixes and general improvements to commands

## 1.3.3 - 2023-01-31

### Added

-   Two new methods to help manage open ai and discord cnd uploads.
-   Embed-generation command can now send message content along with the embed or without it.

### Removed

-   Imagine command using embeds for image command generation. They now upload the render to discord directly. This enables the image to stay in the channel forever.

### Fixed

-   Users not mentioned during welcome or goodbye plugin.

### Security

-   Imagine command (trial) no longer requires users to be premium to use.
