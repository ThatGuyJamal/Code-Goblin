import { parser, Changelog, Release } from 'keep-a-changelog';
import fs from 'fs';

function genCurrent() {
	//Parse a changelog file
	const changelog = parser(fs.readFileSync('CHANGELOG.md', 'UTF-8'));

	//Generate the new changelog string
	console.log(changelog.toString());
}

function create() {
	const changelog = new Changelog('Code Goblin Bot', 'Bug fixes and general improvements to commands')
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

	console.log(changelog.toString());
}

create();
