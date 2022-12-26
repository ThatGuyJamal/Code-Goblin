import { InteractionTypes } from 'oceanic.js';
import config from '../config/config.js';
import { GlobalStatsModel } from '../database/schemas/statistics.js';
export default async function (interaction) {
    if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
        try {
            if (config.IsInDevelopmentMode) {
                console.log(`[${new Date().toISOString()}][command/${interaction.data.name}]: ${interaction.user.tag} (${interaction.user.id})`);
            }
            await GlobalStatsModel.findOneAndUpdate({ find_id: 'global' }, { $inc: { commands_executed: 1 } }, {
                upsert: true,
                new: true
            });
            await this.processCommandInteraction(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction
                .createMessage({
                content: `An error occurred while running \`/${interaction.data.name}\` command.`
            })
                .catch(() => { });
            await GlobalStatsModel.findOneAndUpdate({ find_id: 'global' }, { $inc: { commands_failed: 1 } }, {
                new: true,
                upsert: true
            });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfaW50ZXJhY3Rpb25DcmVhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL2V2ZW50X2ludGVyYWN0aW9uQ3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBeUIsZ0JBQWdCLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDckUsT0FBTyxNQUFNLE1BQU0scUJBQXFCLENBQUM7QUFDekMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHckUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFdBQXNDLFdBQWtDO0lBQzNGLElBQUksV0FBVyxDQUFDLElBQUksS0FBSyxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRTtRQUM5RCxJQUFJO1lBQ0gsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7Z0JBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxhQUFhLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNqSTtZQUNELE1BQU0sZ0JBQWdCLENBQUMsZ0JBQWdCLENBQ3RDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUNyQixFQUFFLElBQUksRUFBRSxFQUFFLGlCQUFpQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQ2xDO2dCQUNDLE1BQU0sRUFBRSxJQUFJO2dCQUNaLEdBQUcsRUFBRSxJQUFJO2FBQ1QsQ0FDRCxDQUFDO1lBQ0YsTUFBTSxJQUFJLENBQUMseUJBQXlCLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDbEQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsTUFBTSxXQUFXO2lCQUNmLGFBQWEsQ0FBQztnQkFDZCxPQUFPLEVBQUUsc0NBQXNDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhO2FBQ2pGLENBQUM7aUJBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO1lBRWxCLE1BQU0sZ0JBQWdCLENBQUMsZ0JBQWdCLENBQ3RDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUNyQixFQUFFLElBQUksRUFBRSxFQUFFLGVBQWUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUNoQztnQkFDQyxHQUFHLEVBQUUsSUFBSTtnQkFDVCxNQUFNLEVBQUUsSUFBSTthQUNaLENBQ0QsQ0FBQztTQUNGO0tBQ0Q7QUFDRixDQUFDIn0=