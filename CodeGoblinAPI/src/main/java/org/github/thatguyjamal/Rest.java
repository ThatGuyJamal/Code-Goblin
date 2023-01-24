package org.github.thatguyjamal;

import org.javacord.api.entity.message.Message;
import org.javacord.api.entity.server.Server;
import org.javacord.api.entity.user.User;

import java.util.Objects;
import static spark.Spark.*;

public class Rest {
    /**
     * Runs the Rest API
     * @param _port The port to run the API on
     */
    public void init(int _port) {
        port(_port);

        // matches "GET /hello/foo" and "GET /hello/bar"
        // request.params(":name") is 'foo' or 'bar'
        get("/hello/:name", (request, response) -> {
            // If no params are passed, return "Hello World"
            if (request.params(":name") == null) {
                return "Hello World";
            }

            if(request.params(":name").equals("API")) {
                return "Edit the /hello/:name to change this message!";
            }

            // If params are passed, return "Hello " + params
            return "Hello " + request.params(":name");
        });

        get("/events/guildCreate", (request, response) -> {
            return "Guild create event";
        });

        get("/events/guildCreate", (request, response) -> {
//            return Objects.requireNonNullElse(guildData, "No data");
            return "Guild delete event";
        });

        get("/events/userJoin", (request, response) -> {
//            return Objects.requireNonNullElse(userData, "No data");
            return "User join event";
        });

        get("/events/userLeave", (request, response) -> {
//            return Objects.requireNonNullElse(userData, "No data");
            return "User leave event";
        });

        get("/events/messageCreate", (request, response) -> {
            return "Total messages in cache: " + Cache.getTotalCachedMessages();
        });

        System.out.println("http://localhost:" + _port + "/hello/API");
    }

    /**
     * Sends guild create data to the api
     * @param guildData The guild data to send
     */
    public static void handleGuildCreate(Server guildData) {

    }

    /**
     * Sends guild delete data to the api
     * @param guildData The guild data to send
     */
    public static void handleGuildDelete(Server guildData) {

    }

    /**
     * Sends user join data to the api
     * @param userData The user data to send
     */
    public static void handleUserJoin(User userData) {

    }

    /**
     * Sends user leave data to the api
     * @param userData The user data to send
     */
    public static void handleUserLeave(User userData) {

    }

    public static void handleMessageCreate(Message message) {
        Cache.addMessage(message);
    }
}
