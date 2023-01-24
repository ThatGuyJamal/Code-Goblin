package org.github.thatguyjamal;

import org.javacord.api.entity.message.Message;

public class Cache {
    /**
     * The message cache
     */
    public static Message[] messages = new Message[100];

    /**
     * Adds a message to the cache
     * @param message The message to add
     */
    public static void addMessage(Message message) {
        System.out.println("[" + message.getIdAsString() + "]" + "Adding message to cache...");
        // Add the message to the cache array and keep the old messages
        for (int i = 0; i < messages.length; i++) {
            if (messages[i] == null) {
                messages[i] = message;
                break;
            }
        }
        System.out.println("[" + message.getIdAsString() + "]" + "Message added to cache!");
    }

    /**
     * Gets the total amount of messages in the cache
     * @return The total amount of messages in the cache
     */
    public static int getTotalCachedMessages() {
        int totalMessages = 0;

        if (Cache.messages[0] == null) {
            return 0;
        }

        for (int i = 0; i < Cache.messages.length; i++) {
            // If the message is null, break the loop
            if (Cache.messages[i] == null) {
                break;
            }

            // If the message is not null, add 1 to the total messages
            totalMessages++;
        }

        return totalMessages;
    }
}
