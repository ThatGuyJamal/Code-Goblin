import { CreateLegacyCommand } from '../../structures/command.js';
import constants from '../../../utils/constants.js';
import { getWelcomeResults } from '../../events/event_welcome.js';
import { getGoodbyeResults } from '../../events/event_goodbye.js';

export default CreateLegacyCommand({
	trigger: 'test-plugin',
	description: `Test a plugin in the bot`,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	devOnly: true,
	argsRequired: 1,
	argsUsage: '<plugin name>',
	run: async ({ instance, message, args }) => {
		const { utils } = instance;

		let validArguments = ['welcome', 'goodbye'];

		if (validArguments && !validArguments.includes(args[0])) {
			return await message.channel?.createMessage({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: ${args[0]} is not a valid plugin.

						Valid plugins: ${validArguments.join(', ')}
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				]
			});
		}

		switch (args[0]) {
			case 'welcome':
				instance.DiscordClient.emit('guildMemberAdd', message.member!);

				let result = await getWelcomeResults(message.member!);

				if (!result) {
					return await message.channel?.createMessage({
						embeds: [
							{
								description: instance.utils.stripIndents(
									`
						\`\`\`asciidoc
						• Error :: No data found for this guild.
						\`\`\`
						`
								),
								color: constants.numbers.colors.primary
							}
						]
					});
				}

				await message.channel?.createMessage({
					embeds: [
						{
							description: instance.utils.stripIndents(`
						Debug Info 

						• Welcome Channel = ${utils.channelMention(result.welcomeChannel.id)}
						• Welcome Message: 
						
						${utils.codeBlock(result.welcomeMessage)}
						`),
							color: constants.numbers.colors.primary
						}
					]
				});
				break;
			case 'goodbye':
				instance.DiscordClient.emit('guildMemberRemove', message.member!, message.member!.guild);

				let result2 = await getGoodbyeResults(message.member!);

				if (!result2) {
					return await message.channel?.createMessage({
						embeds: [
							{
								description: instance.utils.stripIndents(
									`
						\`\`\`asciidoc
						• Error :: No data found for this guild.
						\`\`\`
						`
								),
								color: constants.numbers.colors.primary
							}
						]
					});
				}

				await message.channel?.createMessage({
					embeds: [
						{
							description: instance.utils.stripIndents(`
						Debug Info 

						• Goodbye Channel = ${utils.channelMention(result2.GoodbyeChannel.id)}
						• Goodbye Message:
						
						${utils.codeBlock(result2.GoodbyeMessage)}
						`),
							color: constants.numbers.colors.primary
						}
					]
				});
				break;
		}
	}
});
