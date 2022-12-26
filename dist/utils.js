import config from './config/config.js';
export class Utils {
    instance;
    constructor(instance) {
        this.instance = instance;
    }
    /**
     * Sends logs to the log channels
     * @param type
     * @param options
     * @returns
     */
    sendToLogChannel(type, options) {
        const log = this.instance.DiscordClient.getChannel(type === 'error' ? config.BotErrorLogChannelId : config.BotApiLogChannelId);
        if (!log)
            return;
        return log.createMessage(options);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxNQUFNLE1BQU0sb0JBQW9CLENBQUM7QUFHeEMsTUFBTSxPQUFPLEtBQUs7SUFDVCxRQUFRLENBQU87SUFFdkIsWUFBWSxRQUFjO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLGdCQUFnQixDQUFDLElBQXFCLEVBQUUsT0FBNkI7UUFDM0UsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFnQixDQUFDO1FBRTlJLElBQUksQ0FBQyxHQUFHO1lBQUUsT0FBTztRQUVqQixPQUFPLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQUNEIn0=