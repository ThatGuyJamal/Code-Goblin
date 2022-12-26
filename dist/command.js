import { ApplicationCommandBuilder } from '@oceanicjs/builders';
import config from './config/config.js';
import { MainInstance } from './main.js';
/**
 * Creates a new command
 * @param props The command properties
 * @returns
 */
export function CreateCommand(props) {
    return {
        props,
        toJson: () => {
            const builder = new ApplicationCommandBuilder(props.type, props.trigger).setDescription(props.description);
            props.options?.(builder);
            if (props.defaultMemberPermissions !== undefined) {
                builder.setDefaultMemberPermissions(props.defaultMemberPermissions);
            }
            if (props.descriptionLocalizations !== undefined) {
                builder.setDescriptionLocalizations(props.descriptionLocalizations);
            }
            if (props.dmPermission !== undefined) {
                builder.setDMPermission(props.dmPermission);
            }
            if (props.nameLocalizations !== undefined) {
                builder.setNameLocalizations(props.nameLocalizations);
            }
            return builder.toJSON();
        }
    };
}
/**
 *
 * import { ApplicationCommandTypes } from 'oceanic.js';
import { CreateCommand } from '../../lib/command.js';

export default CreateCommand({
    trigger: '',
    description: ``,
    type: ApplicationCommandTypes.CHAT_INPUT,
    options: (command) => {},
    register: {
        guild: true,
        global: false
    },
    run: async (_instance, interaction) => {}
});
 */
/**
 * Creates Guild Commands for the bot
 * @param client The Discord Client
 */
export async function CreateGuildCommands(client) {
    try {
        const commandsArray = MainInstance.collections.commands.commandStoreArrayJsonGuild;
        for (const guilds of config.DevelopmentServerId) {
            await client.application.bulkEditGuildCommands(guilds, commandsArray);
            console.log(`[INFO] Successfully created ${commandsArray.length} commands in guild ${guilds}`);
        }
        console.log(`[INFO] Successfully created ${commandsArray.length} commands in all guilds`);
    }
    catch (err) {
        console.error(`[ERROR] Failed to create guild commands`, err);
        await MainInstance.utils.sendToLogChannel('error', {
            content: `Failed to create guild commands!\n ${err}`
        });
    }
    console.log('[INFO] Created Guild Commands');
}
/**
 * Creates the global commands for the bot
 * @param client The Discord Client
 */
export async function CreateGlobalCommands(client) {
    try {
        const commandsArray = MainInstance.collections.commands.commandStoreArrayJsonGlobal;
        await client.application.bulkEditGlobalCommands(commandsArray);
        console.log(`[INFO] Successfully created ${commandsArray.length} commands globally`);
        await MainInstance.utils.sendToLogChannel('api', {
            content: `Successfully created ${commandsArray.length} commands globally!`
        });
    }
    catch (err) {
        console.error(`[ERROR] Failed to create global commands`, err);
        await MainInstance.utils.sendToLogChannel('error', {
            content: `Failed to create global commands!\n ${err}`
        });
    }
}
/**
 * Deletes Guild Based Commands for the bot
 * @param client The Discord Client
 */
export async function deleteGuildCommands(client) {
    // Delete Commands from the API
    for (const guild of config.DevelopmentServerId) {
        await client.application.bulkEditGuildCommands(guild, []).catch((err) => {
            console.log(err);
            MainInstance.utils.sendToLogChannel('error', {
                content: `Failed to delete commands in guild ${guild}!\n ${err}`
            });
        });
        await MainInstance.utils.sendToLogChannel('api', {
            content: `Successfully deleted all commands in guild ${guild}!`
        });
    }
}
/**
 * Deletes Global Commands for the bot
 * @param client The Discord Client
 */
export async function deleteGlobalCommands(client) {
    // Delete Commands from the API
    await client.application.bulkEditGlobalCommands([]).catch((err) => {
        console.log(err);
        MainInstance.utils.sendToLogChannel('error', {
            content: `Failed to delete commands globally!\n ${err}`
        });
    });
    await MainInstance.utils.sendToLogChannel('api', {
        content: `Successfully deleted all commands globally!`
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRWhFLE9BQU8sTUFBTSxNQUFNLG9CQUFvQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFnQ3pDOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsYUFBYSxDQUFDLEtBQWM7SUFDM0MsT0FBTztRQUNOLEtBQUs7UUFDTCxNQUFNLEVBQUUsR0FBRyxFQUFFO1lBQ1osTUFBTSxPQUFPLEdBQUcsSUFBSSx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNHLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QixJQUFJLEtBQUssQ0FBQyx3QkFBd0IsS0FBSyxTQUFTLEVBQUU7Z0JBQ2pELE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQzthQUNwRTtZQUNELElBQUksS0FBSyxDQUFDLHdCQUF3QixLQUFLLFNBQVMsRUFBRTtnQkFDakQsT0FBTyxDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2FBQ3BFO1lBQ0QsSUFBSSxLQUFLLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtnQkFDckMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDNUM7WUFDRCxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxTQUFTLEVBQUU7Z0JBQzFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUN0RDtZQUNELE9BQU8sT0FB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