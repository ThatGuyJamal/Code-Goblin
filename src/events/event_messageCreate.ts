import { ButtonStyles, ComponentTypes, Message } from 'oceanic.js';
import config from '../config/config.js';
import { MainInstance } from '../main.js';
import { getGoodbyeResults } from './event_goodbye.js';
import { getWelcomeResults } from './event_welcome.js';

const test_command_names = ['test-help', 'test-welcome', 'test-goodbye'];

export default async function (message: Message) {
	if (!message.guild) return;
	if (!message.channel) return;
	if (message.author.bot) return;
	if (!message.member) return;

	const isOwners = MainInstance.keys.super_users.has(message.author.id);

	const botMention = `<@${MainInstance.DiscordClient.user.id}>`;

	if (isOwners) {
		// Read arguments for prefix and the command
		const args = message.content.slice(config.BotPrefix.length).trim().split(/ +/g);
		const command = args.shift()?.toLowerCase();

		// Reply with the list of test commands if the bot is mentioned in a message
		if (message.content.startsWith(botMention)) {
			return await message.channel.createMessage({
				content: `Prefix: ${config.BotPrefix} | Test commands: ${test_command_names.join(',')}`
			});
		}

		if (command === 'test-help') {
			return await message.channel.createMessage({
				content: `Test commands: ${test_command_names.join(', ')}`
			});
		}

		if (command === 'test-welcome') {
			MainInstance.DiscordClient.emit('guildMemberAdd', message.member);

			let data = await getWelcomeResults(message.member);

			await message.channel.createMessage({
				content: 'Test welcome plugin ran!',
				embeds: [
					{
						description: `Sending to...<#${data?.welcomeChannel.id}>\n\n${data?.welcomeMessage}`
					}
				]
			});
		}

		if (command === 'test-goodbye') {
			MainInstance.DiscordClient.emit('guildMemberRemove', message.member, message.member.guild);

			let data = await getGoodbyeResults(message.member);

			await message.channel.createMessage({
				content: 'Test goodbye plugin ran!',
				embeds: [
					{
						description: `Sending to...<#${data?.GoodbyeChannel.id}>\n\n${data?.GoodbyeMessage}`
					}
				]
			});
		}
	} else {
		// Reply with the list of test commands if the bot is mentioned in a message
		if (message.content.startsWith(botMention)) {
			return await message.channel.createMessage({
				content: `Please use my slash command \`/commands\` to see a list of commands!`,
				components: [
					{
						type: ComponentTypes.ACTION_ROW,
						components: [
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Invite Bot',
								url: config.BotClientOAuth2Url
							},
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Code Repository',
								url: config.GithubRepository
							},
							{
								type: ComponentTypes.BUTTON,
								style: ButtonStyles.LINK,
								label: 'Website',
								url: config.whisper_room.url,
								disabled: true
							}
						]
					}
				]
			});
		}
	}
}
