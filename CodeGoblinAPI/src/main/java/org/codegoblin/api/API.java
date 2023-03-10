package org.codegoblin.api;

import io.github.cdimascio.dotenv.Dotenv;
import org.javacord.api.entity.DiscordEntity;
import org.javacord.api.entity.server.Server;

import static spark.Spark.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Our API class.
 */
public class API {
    public static Discord discord = new Discord();

    private static final Map<String, String> usernamePasswords = new HashMap<String, String>();

    public static void main(String[] args) {

        // Sets the port to 3030.
        // http://localhost:3030/
        port(3030);

        Dotenv dotenv = Dotenv.load();

        // Load the username and password from the .env file.
        String _username = dotenv.get("API_AUTH_USERNAME");
        String _password = dotenv.get("API_AUTH_PASSWORD");

        // Add the username and password to the map.
        usernamePasswords.put(_username, _password);

        path("/ws", () -> {
            webSocket("/echo", WebSocket.class);
        });

        // Creates simple authentication for the API.
        // Example: http://localhost:3030/api/v1/guilds?user=someguy&password=someguyspassword
        before((request, response) -> {
            String user = request.queryParams("user");
            String password = request.queryParams("password");

            String dbPassword = usernamePasswords.get(user);
            if (!(password != null && password.equals(dbPassword))) {
                halt(401, "Unauthorized access!");
            }
        });

        path("/api", () -> {

            get("/",  (request, response) -> {
                response.type("application/json");
                ArrayList<Object> attributes = new ArrayList<>();

                // Add a list of endpoints to the attributes list.
                attributes.add("/api/v1/guilds");
                attributes.add("/api/v1/guilds/:id");

                return attributes;
            }, new JsonTransformer());

            path("/v1", () -> {
                // Gets the discord guild data for all cached servers.
                get("/guilds", (request, response) -> {
                    try {
                        response.type("application/json");

                        // Creates an Array to store and return guild attributes.
                        ArrayList<Object> attributes = new ArrayList<>();

                        // After fetching the guilds, we can loop through them and add them to the attributes map.
                        // The key is the guild ID, and the value is the guild name.
                        discord.GetGuilds().forEach((guild) -> {
                            // Create a new map to store the guild data.
                            Map<String, Object> store = new HashMap<>();

                            // Add the guild data to the attributes map.
                            store.put("id", guild.getIdAsString());
                            store.put("name", guild.getName());
                            store.put("memberCount", guild.getMemberCount());

                            // Add the map to the attributes list.
                            attributes.add(store);
                        });

                        return attributes;
                    } catch (Exception e) {
                        e.printStackTrace();
                        halt(500, "Internal server error!");
                        return "Internal server error!";
                    }
                }, new JsonTransformer());

                // Get a guild by ID.
                get("/guilds/:id", (request, response) -> {
                    try {
                        response.type("application/json");
                        Map<String, Object> attributes = new HashMap<>();

                        // Get the guild id from the request params.
                        Server guild = discord.GetGuild(request.params(":id"));

                        // if no guild is found, return a 404.
                        if (guild == null) {
                            halt(404, "Guild not found!");
                            return "Guild not found!";
                        }

                        // Data
                        attributes.put("id", guild.getIdAsString());
                        attributes.put("name", guild.getName());
                        attributes.put("memberCount", guild.getMemberCount());
                        attributes.put("description", guild.getDescription().isPresent() ? guild.getDescription().get() : null);
                        attributes.put("icon", guild.getIcon().isPresent() ? guild.getIcon().get().getUrl().toString() : null);
                        attributes.put("splash", guild.getSplash().isPresent() ? guild.getSplash().get().getUrl().toString() : null);
                        attributes.put("vanityUrl", guild.getVanityUrlCode().isPresent() ? guild.getVanityUrlCode().get() : null);
                        attributes.put("verificationLevel", guild.getVerificationLevel().toString());
                        attributes.put("region", guild.getRegion().toString());
                        attributes.put("afkChannel", guild.getAfkChannel().isPresent() ? guild.getAfkChannel().get().getName() : null);
                        attributes.put("systemChannel", guild.getSystemChannel().isPresent() ? guild.getSystemChannel().get().getName() : null);
                        attributes.put("systemChannelFlags", guild.getSystemChannelFlags());
                        attributes.put("widgetChannel", guild.getWidgetChannel().isPresent() ? guild.getWidgetChannel().get().getName() : null);
                        attributes.put("widgetEnabled", guild.isWidgetEnabled());
                        attributes.put("createdAt", guild.getCreationTimestamp().toString());
                        attributes.put("rulesChannelId", guild.getRulesChannel().isPresent() ? guild.getRulesChannel().get().getId() : null);
                        attributes.put("boostersCount", guild.getBoostCount());
                        attributes.put("boostersTier", guild.getBoostLevel().toString());

                        // Mapped Data
                        attributes.put("roles", guild.getRoles().stream().map(DiscordEntity::getIdAsString).toArray());
                        attributes.put("channels", guild.getChannels().stream().map(DiscordEntity::getIdAsString).toArray());
                        attributes.put("emojis", guild.getCustomEmojis().stream().map(DiscordEntity::getIdAsString).toArray());
                        attributes.put("members", guild.getMembers().stream().map(DiscordEntity::getIdAsString).toArray());
                        attributes.put("features", guild.getFeatures().stream().map(Enum::toString).toArray());

                        return attributes;
                    } catch (Exception e) {
                        e.printStackTrace();
                        halt(500, "Internal server error!");
                        return "Internal server error!";
                    }
                }, new JsonTransformer());
            });
        });

        System.out.println("API is running on port 3030.");
    }
}