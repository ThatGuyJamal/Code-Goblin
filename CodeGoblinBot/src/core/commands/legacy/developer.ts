import { CreateLegacyCommand } from '../../structures/command.js';
import constants from '../../../utils/constants.js';
import { getWelcomeResults } from '../../events/event_welcome.js';
import { getGoodbyeResults } from '../../events/event_goodbye.js';
import config from '../../../config/config.js';
import { PremiumUserLevels } from '../../../typings/database/types.js';

export default CreateLegacyCommand({
	trigger: 'dev',
	description: `Test a plugin in the bot`,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	devOnly: true,
	argsRequired: 1,
	argsUsage: '<subcommand> [args]',
	run: async ({ instance, message, args }) => {
		const { utils } = instance;

		let validSubCommands = ['test-welcome', 'test-goodbye', 'premium-user'];

		// Used for premium command management
		let validPremiumSubCommandArgs = ['add', 'remove', 'list'];

		if (validSubCommands && !validSubCommands.includes(args[0])) {
			return await message.channel?.createMessage({
				embeds: [
					{
						description: instance.utils.stripIndents(
							`
						\`\`\`asciidoc
						• Error :: ${args[0]} is not a valid subcommand.

						Valid plugins: ${validSubCommands.join(', ')}
						\`\`\`
						`
						),
						color: constants.numbers.colors.primary
					}
				]
			});
		}

		switch (args[0]) {
			case 'test-welcome':
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
			case 'test-goodbye':
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
			case 'premium-user':
				if (!args[1]) {
					return await message.channel?.createMessage({
						embeds: [
							{
								description: instance.utils.stripIndents(
									`
						\`\`\`asciidoc
						• Error :: No subcommand argument provided.

						Valid subcommands: ${validPremiumSubCommandArgs.join(', ')}
						\`\`\`
						`
								),
								color: constants.numbers.colors.primary
							}
						]
					});
				}

				if (!validPremiumSubCommandArgs.includes(args[1])) {
					return await message.channel?.createMessage({
						embeds: [
							{
								description: instance.utils.stripIndents(
									`
						\`\`\`asciidoc
						• Error :: ${args[1]} is not a valid subcommand.

						Valid subcommands: ${validPremiumSubCommandArgs.join(', ')}
						\`\`\`
						`
								),
								color: constants.numbers.colors.primary
							}
						]
					});
				}

				switch (args[1]) {
					case 'add':
						try {
							if (!args[2]) {
								return await message.channel?.createMessage({
									embeds: [
										{
											description: instance.utils.stripIndents(
												`
						\`\`\`asciidoc
						• Error :: No user ID argument provided.

						Usage: ${config.BotPrefix}debug premium-user add <ID>
						\`\`\`
						`
											),
											color: constants.numbers.colors.primary
										}
									]
								});
							}

							if (!utils.isUserId(args[2])) {
								return await message.channel?.createMessage({
									embeds: [
										{
											description: instance.utils.stripIndents(
												`
						\`\`\`asciidoc
						• Error :: Invalid user ID provided.
						\`\`\`
						`
											),
											color: constants.numbers.colors.primary
										}
									]
								});
							}

							let isPremium = await instance.database.schemas.premiumUser.CheckIfPremiumUser(args[2]);

							if (isPremium) {
								return await message.channel?.createMessage({
									embeds: [
										{
											description: instance.utils.stripIndents(
												`
						\`\`\`asciidoc
						• Error :: This user is already a premium user.
						\`\`\`
						`
											),
											color: constants.numbers.colors.primary
										}
									]
								});
							}

							if (!args[3]) {
								return await message.channel?.createMessage({
									embeds: [
										{
											description: instance.utils.stripIndents(
												`
						\`\`\`asciidoc
						• Error :: No premium level argument provided.

						Example: ${config.BotPrefix}dev premium-user ${args[2]} <id>
						\`\`\`
						`
											),
											color: constants.numbers.colors.primary
										}
									]
								});
							}

							if (args[3].toLowerCase() === 'lifetime' || args[3].toLowerCase() === 'l') {
								await instance.database.schemas.premiumUser.CreatePremiumUser({
									user_id: args[2],
									activated: true,
									activated_at: Date.now(),
									expires_at: null,
									level: PremiumUserLevels.LIFE_TIME
								});
							}

							if (args[3].toLowerCase() === 'yearly' || args[3].toLowerCase() === 'y') {
								await instance.database.schemas.premiumUser.CreatePremiumUser({
									user_id: args[2],
									activated: true,
									activated_at: Date.now(),
									expires_at: null,
									level: PremiumUserLevels.YEARLY
								});
							}

							if (args[3].toLowerCase() === 'monthly' || args[3].toLowerCase() === 'm') {
								await instance.database.schemas.premiumUser.CreatePremiumUser({
									user_id: args[2],
									activated: true,
									activated_at: Date.now(),
									expires_at: null,
									level: PremiumUserLevels.MONTHLY
								});
							}

							await message.channel?.createMessage({
								embeds: [
									{
										description: instance.utils.stripIndents(`
						\`\`\`asciidoc
						• Success :: Premium user added.
						\`\`\`
									`),
										color: constants.numbers.colors.primary
									}
								]
							});

							await instance.utils.sendToLogChannel(
								'premium',
								utils.stripIndents(`
							Premium user added.

							• User ID      = ${instance.utils.userMention(args[2])} (ID:${args[2]})
							• Level        = \`${args[3]}\`
							• Activated    = \`Yes\`
							• Activated At = \`${Date.now()}\`
							• Expires At   = \`n/a\`
							`),
								true,
								'Premium'
							);
						} catch (error) {
							message.channel?.createMessage({
								embeds: [
									{
										description: instance.utils.stripIndents(`
						\`\`\`asciidoc
						• Error :: ${error}
						\`\`\`
									`),
										color: constants.numbers.colors.primary
									}
								]
							});
						}

						break;
					case 'remove':
						try {
							if (!args[2]) {
								return await message.channel?.createMessage({
									embeds: [
										{
											description: instance.utils.stripIndents(
												`
						\`\`\`asciidoc
						• Error :: No user ID argument provided.

						Example: ${config.BotPrefix}dev premium-user remove <id>
						\`\`\`
						`
											),
											color: constants.numbers.colors.primary
										}
									]
								});
							}

							if (!utils.isUserId(args[2])) {
								return await message.channel?.createMessage({
									embeds: [
										{
											description: instance.utils.stripIndents(
												`
						\`\`\`asciidoc
						• Error :: Invalid user ID provided.
						\`\`\`
						`
											),
											color: constants.numbers.colors.primary
										}
									]
								});
							}

							let isPremium = await instance.database.schemas.premiumUser.CheckIfPremiumUser(args[2]);

							if (!isPremium) {
								return await message.channel?.createMessage({
									embeds: [
										{
											description: instance.utils.stripIndents(
												`
						\`\`\`asciidoc
						• Error :: This user is not a premium user.
						\`\`\`
						`
											),
											color: constants.numbers.colors.primary
										}
									]
								});
							}

							const result = await instance.database.schemas.premiumUser.DeletePremiumUser(args[2]);

							if (!result) {
								return await message.channel?.createMessage({
									embeds: [
										{
											description: instance.utils.stripIndents(
												`
						\`\`\`asciidoc
						• Error :: Failed to remove premium user.
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
										description: instance.utils.stripIndents(
											`
						\`\`\`asciidoc
						• Success :: Premium user removed.
						\`\`\`
						`
										),
										color: constants.numbers.colors.primary
									}
								]
							});

							await instance.utils.sendToLogChannel(
								'premium',
								utils.stripIndents(`
							Premium user Removed.

							User = ${instance.utils.userMention(args[2])} (ID:${args[2]})
							`),
								true,
								'Premium'
							);
						} catch (error) {
							message.channel?.createMessage({
								embeds: [
									{
										description: instance.utils.stripIndents(`
						\`\`\`asciidoc
						• Error :: ${error}
						\`\`\`
									`),
										color: constants.numbers.colors.primary
									}
								]
							});
						}

						break;
					case 'list':
						try {
							const premiumUsers = await instance.database.schemas.premiumUser.GetPremiumUsers();

							if (premiumUsers.length === 0) {
								return await message.channel?.createMessage({
									embeds: [
										{
											description: instance.utils.stripIndents(
												`
						\`\`\`asciidoc
						• Error :: No premium users to list.
						\`\`\`
						`
											),
											color: constants.numbers.colors.primary
										}
									]
								});
							}

							const users = premiumUsers
								.map((user: any) => {
									return `> ${instance.utils.userMention(user.user_id)} (ID:${user.user_id})`;
								})
								.join('\n');

							return await message.channel?.createMessage({
								embeds: [
									{
										description: instance.utils.stripIndents(
											`
						\`\`\`asciidoc
						• Success :: Premium users listed.
						\`\`\`
						**Users:**
						${users}
						`
										),
										color: constants.numbers.colors.primary
									}
								]
							});
						} catch (error) {
							message.channel?.createMessage({
								embeds: [
									{
										description: instance.utils.stripIndents(`
						\`\`\`asciidoc
						• Error :: ${error}
						\`\`\`
									`),
										color: constants.numbers.colors.primary
									}
								]
							});
						}
						break;
					default:
						return await message.channel?.createMessage({
							embeds: [
								{
									description: instance.utils.stripIndents(`
						\`\`\`asciidoc
						• Error :: Invalid subcommand provided.
						\`\`\`
									`),
									color: constants.numbers.colors.primary
								}
							]
						});
				}
		}
	}
});
