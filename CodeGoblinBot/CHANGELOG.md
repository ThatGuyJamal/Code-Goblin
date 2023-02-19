# Code Goblin Bot

Change log for the Code Goblin Bot

## 2.0.2 - 2023-02-18

Minor bug fixes and improvements.

### Added

- ServerConfig command to view and edit server settings
- ServerConfig mongodb model and schema functions
- il8n translations for all commands
- Utility functions are not managed by the sapphire plugin system
- Database caching (optional)
- Debug logs on all database operations

### Fixed

- Help command not formatting right
- Plugins not loading properly
- Logging disabled in production mode

### Security

- Added more error catching to node process

## 2.0.0 - 2023-02-17

Major version changes and improvements.

### Added

- Sapphire Framework (built on discord.js)
- Refactored codebase

### Removed

- Oceanic.js library
- Code Jam plugin

### Fixed

- GuildMemberLeave event now works properly
- Imagine AI command now works properly
- Rate-limiting for commands

### Security

- Database now uses a new method of storing data. This will allow for more efficient data storage and retrieval.
- Better Command Permission limits

## 1.3.3 - 2023-01-31

### Added

- Two new methods to help manage open ai and discord cnd uploads.
- Embed-generation command can now send message content along with the embed or without it.

### Removed

- Imagine command using embeds for image command generation. They now upload the render to discord directly. This
  enables the image to stay in the channel forever.

### Fixed

- Users not mentioned during welcome or goodbye plugin.

### Security

- Imagine command (trial) no longer requires users to be premium to use.
