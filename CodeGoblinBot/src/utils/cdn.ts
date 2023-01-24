export class CDN {
	private DISCORD_CDN: string = 'https://cdn.discordapp.com/attachments/';

	get(channelId: string, messageId: string, fileName: string): string {
		return `${this.DISCORD_CDN}${channelId}/${messageId}/${fileName}`;
	}
}
