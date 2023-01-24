package org.github.thatguyjamal;

import io.github.cdimascio.dotenv.Dotenv;
import org.javacord.api.DiscordApi;
import org.javacord.api.DiscordApiBuilder;
import org.javacord.api.entity.channel.TextChannel;
import org.javacord.api.entity.intent.Intent;

public class Discord {
    // Load the .env file
    Dotenv dotenv = Dotenv.load();
    // Create a new instance of the Discord API
    public DiscordApi api = new DiscordApiBuilder()
            .setToken(dotenv.get("BOT_TOKEN"))
            .addIntents(Intent.GUILDS, Intent.GUILD_MEMBERS, Intent.GUILD_MESSAGES, Intent.MESSAGE_CONTENT)
            .login().join();
    /**
     * Runs the Discord API
     */
    public void init() {
        System.out.println("Running Discord API");

        api.addServerBecomesAvailableListener(event -> {
            System.out.println("Server available: " + event.getServer().getName());
            Rest.handleGuildCreate(event.getServer());
        });

        api.addServerBecomesUnavailableListener(event -> {
            System.out.println("Server unavailable: " + event.getServer().getName());
            Rest.handleGuildDelete(event.getServer());
        });

        api.addServerMemberJoinListener(event -> {
            System.out.println("Member joined: " + event.getUser().getName() + "| " + event);
            Rest.handleUserJoin(event.getUser());
        });

        api.addServerMemberLeaveListener(event -> {
            System.out.println("Member left: " + event.getUser().getName());
            Rest.handleUserLeave(event.getUser());
        });

        api.addMessageCreateListener(event -> {

            // Ignore messages from yourself
            if(event.getMessage().getAuthor().isYourself()) return;
            // Check if the message is from a bot
            if (event.getMessage().getAuthor().isBotUser()) {
                return;
            }

            System.out.println("Message received: " + event.getMessage().getContent());
            Rest.handleMessageCreate(event.getMessage());
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
