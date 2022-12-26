import config from './config/config.js';
import { MainInstance } from './main.js';
export const isCanary = false;
async function bootstrap() {
    if (config.IsInDevelopmentMode && !config.register_commands.create.guild) {
        console.log('[WARNING] Guild only commands are disabled and we are not in production mode.');
    }
    await MainInstance.init();
}
process
    .on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Rejection:', err, promise);
})
    .on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
})
    .on('uncaughtExceptionMonitor', (err, origin) => {
    console.error('Uncaught Exception Monitor:', err, origin);
});
bootstrap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNLE1BQU0sb0JBQW9CLENBQUM7QUFDeEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV6QyxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBRTlCLEtBQUssVUFBVSxTQUFTO0lBQ3ZCLElBQUksTUFBTSxDQUFDLG1CQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQywrRUFBK0UsQ0FBQyxDQUFDO0tBQzdGO0lBRUQsTUFBTSxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDM0IsQ0FBQztBQUVELE9BQU87S0FDTCxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFDMUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDckQsQ0FBQyxDQUFDO0tBQ0QsRUFBRSxDQUFDLG1CQUFtQixFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQyxDQUFDLENBQUM7S0FDRCxFQUFFLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDL0MsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0QsQ0FBQyxDQUFDLENBQUM7QUFFSixTQUFTLEVBQUUsQ0FBQyJ9