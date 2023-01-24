package org.github.thatguyjamal;

import io.github.cdimascio.dotenv.Dotenv;
import org.javacord.api.DiscordApi;
import org.javacord.api.DiscordApiBuilder;
import org.javacord.api.entity.channel.TextChannel;
import org.javacord.api.entity.intent.Intent;

public class Discord {
    Dotenv dotenv = Dotenv.load();
    public DiscordApi api = new DiscordApiBuilder()
            .setToken(dotenv.get("BOT_TOKEN"))
            .addIntents(Intent.GUILDS, Intent.GUILD_MEMBERS)
            .login().join();
    public void init() {
        System.out.println("Running Discord API");

        api.addServerBecomesAvailableListener(event -> {
            System.out.println("Server available: " + event.getServer().getName());
        });

        api.addServerBecomesUnavailableListener(event -> {
            System.out.println("Server unavailable: " + event.getServer().getName());
        });

        api.addServerMemberJoinListener(event -> {
            System.out.println("Member joined: " + event.getUser().getName());
        });

        api.addServerMemberLeaveListener(event -> {
            System.out.println("Member left: " + event.getUser().getName());
        });
    }

    /**
     * Creates a log message in the log channel
     * @param message The message to send
     */

    public void CreateLogMessage(String message) {
        // Get the log channel
        TextChannel logChannel = api.getTextChannelById("1056292297756639342").get();

        // Send the message
        logChannel.sendMessage(message);
    }
}
