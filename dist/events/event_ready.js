import { deleteGuildCommands, deleteGlobalCommands, CreateGuildCommands, CreateGlobalCommands } from '../command.js';
import config from '../config/config.js';
import { MainInstance } from '../main.js';
export default async function (client) {
    await MainInstance.loadCommands();
    if (config.register_commands.delete.guild)
        await deleteGuildCommands(client);
    if (config.register_commands.delete.global)
        await deleteGlobalCommands(client);
    if (config.register_commands.create.guild)
        await CreateGuildCommands(client);
    if (config.register_commands.create.global)
        await CreateGlobalCommands(client);
    console.log(`[EVENT] Ready As`, client.user.tag);
    await MainInstance.utils.sendToLogChannel('api', {
        content: `Ready as ${client.user.tag} (${client.user.id})`
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfcmVhZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL2V2ZW50X3JlYWR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNySCxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRTFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLE1BQWM7SUFDNUMsTUFBTSxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7SUFFbEMsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEtBQUs7UUFBRSxNQUFNLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdFLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxNQUFNO1FBQUUsTUFBTSxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUUvRSxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsS0FBSztRQUFFLE1BQU0sbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0UsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLE1BQU07UUFBRSxNQUFNLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRS9FLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVqRCxNQUFNLFlBQVksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFO1FBQ2hELE9BQU8sRUFBRSxZQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHO0tBQzFELENBQUMsQ0FBQztBQUNKLENBQUMifQ==