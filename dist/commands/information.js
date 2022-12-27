import { EmbedBuilder } from '@oceanicjs/builders';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ButtonStyles, ComponentTypes } from 'oceanic.js';
import { client } from '../client.js';
import { CreateCommand } from '../command.js';
import ms from 'ms';
import config from '../config/config.js';
import constants from '../constants.js';
import { GlobalStatsModel } from '../database/schemas/statistics.js';
export default CreateCommand({
    trigger: 'information',
    description: 'View information about the bot and its services',
    type: ApplicationCommandTypes.CHAT_INPUT,
    register: 'global',
    requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
    requiredUserPermissions: ['SEND_MESSAGES', 'MANAGE_GUILD'],
    options: (opts) => {
        opts.addOption('option', ApplicationCommandOptionTypes.STRING, (option) => {
            option
                .setName('type')
                .setDescription('The type of statistics to show')
                .addChoice('Bot', 'bot')
                .addChoice('Company', 'company')
                .setRequired(true);
        }).setDMPermission(false);
    },
    run: async (instance, interaction) => {
        const type = interaction.data.options.getStringOption('type', true);
        let embed = new EmbedBuilder();
        if (type.value === 'company') {
            embed.setTitle('Company Statistics');
            embed.setDescription('About the developers of Whisper Room');
            embed.addField('About', constants.strings.commands.info.company.bio, true);
            embed.setColor(constants.numbers.colors.primary);
            await interaction.createMessage({
                embeds: [embed.toJSON()],
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
                                url: config.whisper_room.url
                            }
                        ]
                    }
                ]
            });
        }
        else if (type.value === 'bot') {
            let statusCode = instance.database.network_status();
            const global = (await GlobalStatsModel.findOne({ id: 'global' }));
            embed.setTitle('Bot Statistics');
            embed.setDescription('Displaying current data below');
            embed.setColor(constants.numbers.colors.primary);
            let cpuUsage = process.cpuUsage();
            let cpuUsagePercentage = (cpuUsage.user + cpuUsage.system) / 1000 / 1000 / 1000 / 1000;
            embed.addField('CPU Usage', `${cpuUsagePercentage.toFixed(2)}%`, true);
            embed.addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true);
            embed.addField('Uptime', ms(client.uptime, { long: true }), true);
            embed.addField('Guilds Cached', `${client.guilds.size}`, true);
            embed.addField('Guilds Joined', `${global.guilds_joined}`, true);
            embed.addField('Guilds Left', `${global.guilds_left}`, true);
            embed.addField('Users Cached', `${client.users.size}`, true);
            embed.addField('Discord API Library', `[Oceanic.js-v1.4.0](https://oceanic.ws/)`, true);
            embed.addField('Database State', `${statusCode ? 'Online' : 'Offline'}`, true);
            embed.addField('Total Commands', `${instance.collections.commands.commandStoreMap.size}`, true);
            embed.addField('Commands Executed', `${global.commands_executed}`, true);
            embed.addField('Commands Failed', `${global.commands_failed}`, true);
            await interaction.createMessage({
                embeds: [embed.toJSON()],
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
                                url: config.whisper_room.url
                            }
                        ]
                    }
                ]
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvaW5mb3JtYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBRSw2QkFBNkIsRUFBRSx1QkFBdUIsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ2xILE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDcEIsT0FBTyxNQUFNLE1BQU0scUJBQXFCLENBQUM7QUFDekMsT0FBTyxTQUFTLE1BQU0saUJBQWlCLENBQUM7QUFDeEMsT0FBTyxFQUFvQixnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRXZGLGVBQWUsYUFBYSxDQUFDO0lBQzVCLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxpREFBaUQ7SUFDOUQsSUFBSSxFQUFFLHVCQUF1QixDQUFDLFVBQVU7SUFDeEMsUUFBUSxFQUFFLFFBQVE7SUFDbEIsc0JBQXNCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLHFCQUFxQixDQUFDO0lBQy9FLHVCQUF1QixFQUFFLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQztJQUMxRCxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSw2QkFBNkIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN6RSxNQUFNO2lCQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUM7aUJBQ2YsY0FBYyxDQUFDLGdDQUFnQyxDQUFDO2lCQUNoRCxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztp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