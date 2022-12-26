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
    options: (opts) => {
        opts.addOption('option', ApplicationCommandOptionTypes.STRING, (option) => {
            option
                .setName('type')
                .setDescription('The type of statistics to show')
                .addChoice('Company', 'company')
                .addChoice('Bot', 'bot')
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
                                url: config.DevelopmentServerInviteUrl
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
            let cpuUsage = process.cpuUsage();
            let cpuUsagePercentage = (cpuUsage.user + cpuUsage.system) / 1000 / 1000 / 1000 / 1000;
            embed.addField('CPU Usage', `${cpuUsagePercentage.toFixed(2)}%`, true);
            embed.addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true);
            embed.addField('Uptime', ms(client.uptime, { long: true }), true);
            embed.addField('Guilds', `${client.guilds.size}`, true);
            embed.addField('Guilds Joined', `${global.guilds_joined}`, true);
            embed.addField('Guilds Left', `${global.guilds_left}`, true);
            embed.addField('Users Cached', `${client.users.size}`, true);
            embed.addField('Discord API Library', `[Oceanic.js-v1.4.0](https://oceanic.ws/)`, true);
            embed.addField('Database State', `${statusCode ? 'Online' : 'Offline'}`, true);
            embed.addField('Total Commands', `${instance.collections.commands.commandStoreMap.size}`, true);
            embed.addField('Commands Executed', `${global.commands_executed}`, true);
            embed.addField('Commands Failed', `${global.commands_failed}`, true);
            if (statusCode) {
                embed.setColor(0x00ff00);
            }
            else {
                embed.setColor(0xff0000);
            }
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
                                url: config.DevelopmentServerInviteUrl
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvaW5mb3JtYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBRSw2QkFBNkIsRUFBRSx1QkFBdUIsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ2xILE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDcEIsT0FBTyxNQUFNLE1BQU0scUJBQXFCLENBQUM7QUFDekMsT0FBTyxTQUFTLE1BQU0saUJBQWlCLENBQUM7QUFDeEMsT0FBTyxFQUFvQixnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRXZGLGVBQWUsYUFBYSxDQUFDO0lBQzVCLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxpREFBaUQ7SUFDOUQsSUFBSSxFQUFFLHVCQUF1QixDQUFDLFVBQVU7SUFDeEMsUUFBUSxFQUFFLFFBQVE7SUFDbEIsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsNkJBQTZCLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDekUsTUFBTTtpQkFDSixPQUFPLENBQUMsTUFBTSxDQUFDO2lCQUNmLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQztpQkFDaEQsU0FBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7aUJBQy9CLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO2lCQUN2QixXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFD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