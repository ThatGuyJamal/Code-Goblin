const { Changelog, Release } = require('keep-a-changelog');
const fs = require('node:fs');

function genCurrent() {
	//Parse a changelog file
	const changelog = parser(fs.readFileSync('CHANGELOG.md', 'UTF-8'));

	//Generate the new changelog string
	console.log(changelog.toString());
}

// genCurrent();

function create() {
	const changelog = new Changelog('Code Goblin Bot', 'Change log for the Code Goblin Bot')
		.addRelease(
			new Release('2.0.2', '2023-02-18', 'Minor bug fixes and improvements.')
				.added(`ServerConfig command to view and edit server settings`)
				.added(`ServerConfig mongodb model and schema functions`)
				.added(`il8n translations for all commands`)
				.added(`Utility functions are not managed by the sapphire plugin system`)
				.added(`Database caching (optional)`)
				.added(`Debug logs on all database operations`)
				.fixed(`Help command not formatting right`)
				.fixed(`Plugins not loading properly`)
				.fixed(`Logging disabled in production mode`)
				.security(`Added more error catching to node process`)
		)
		.addRelease(
			new Release('2.0.0', '2023-02-17', 'Major version changes and improvements.')
				.added(`Sapphire Framework (built on discord.js)`)
				.added(`Refactored codebase`)
				.fixed(`GuildMemberLeave event now works properly`)
				.fixed(`Imagine AI command now works properly`)
				.fixed(`Rate-limiting for commands`)
				.removed(`Oceanic.js library`)
				.removed(`Code Jam plugin`)
				.security(`Database now uses a new method of storing data. This will allow for more efficient data storage and retrieval.`)
				.security(`Better Command Permission limits`)
		)
		.addRelease(
			new Release('1.3.3', '2023-01-31')
				.added('Two new methods to help manage open ai and discord cnd uploads.')
				.fixed('Users not mentioned during welcome or goodbye plugin.')
				.removed(
					'Imagine command using embeds for image command generation. They now upload the render to discord directly. This enables the image to stay in the channel forever.'
				)
				.added(`Embed-generation command can now send message content along with the embed or without it.`)
				.security('Imagine command (trial) no longer requires users to be premium to use.')
		);

	console.clear();
	console.log(changelog.toString());
}

create();
