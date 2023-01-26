package org.codegoblin.api;

import io.github.cdimascio.dotenv.Dotenv;
import org.javacord.api.DiscordApi;
import org.javacord.api.DiscordApiBuilder;
import org.javacord.api.entity.channel.TextChannel;
import org.javacord.api.entity.intent.Intent;
import org.javacord.api.entity.server.Server;

import java.util.Set;

public class Discord {
    // Loads the .env file
    static Dotenv dotenv = Dotenv.load();
    // Create a new instance of the Discord API
    public static DiscordApi client = new DiscordApiBuilder()
            .setToken(dotenv.get("BOT_TOKEN"))
            .addIntents(Intent.GUILDS, Intent.GUILD_MEMBERS, Intent.GUILD_MESSAGES, Intent.MESSAGE_CONTENT)
            .login().join();

    public static void main(String[] args) {
        System.out.println("Running Discord API");

        client.addServerBecomesAvailableListener(event -> {
            System.out.println("Server available: " + event.getServer().getName());
            System.out.println(event.getServer());
        });

        client.addServerBecomesUnavailableListener(event -> {
            System.out.println("Server unavailable: " + event.getServer().getName());
            System.out.println(event.getServer());
        });

        client.addServerJoinListener(event -> {
            System.out.println("Joined server: " + event.getServer().getName());
        });

        client.addServerLeaveListener(event -> {
            System.out.println("Left server: " + event.getServer().getName());
        });
    }

    /**
     * Gets all the guilds the bot is in
     * @return A set of guilds
     */
    public Set<Server> GetGuilds() {
        return client.getServers();
    }

    /**
     * Gets a guild by ID
     * @param id The ID of the guild
     * @return The guild
     */
    public Server GetGuild(String id) {
        return client.getServerById(id).get();
    }

    /**
     * Creates a log message in the log channel
     * @param message The message to send
     */
    public void CreateLogMessage(String message) {
        // Get the log channel
        TextChannel logChannel = client.getTextChannelById("1067999758444142652").get();

        // Send the message
        logChannel.sendMessage(message);
    }
}
