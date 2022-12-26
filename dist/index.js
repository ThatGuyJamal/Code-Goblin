import { MainInstance } from './main.js';
async function bootstrap() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV6QyxLQUFLLFVBQVUsU0FBUztJQUN2QixNQUFNLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBRUQsT0FBTztLQUNMLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUMxQyxPQUFPLENBQUMsS0FBSyxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyRCxDQUFDLENBQUM7S0FDRCxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNDLENBQUMsQ0FBQztLQUNELEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRTtJQUMvQyxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUMsQ0FBQztBQUVKLFNBQVMsRUFBRSxDQUFDIn0=