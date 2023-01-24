package org.github.thatguyjamal;

import org.github.thatguyjamal.discord.Discord;

public class Main {
    public static void main(String[] args) {
        // Create a new instance of the Rest class
        Rest rest = new Rest();

        // Create a new instance of the Discord class
        Discord discord = new Discord();

        // Run the init() method in the Rest class
        rest.init();

        // Run the init() method in the Discord class
        // discord.init();
        System.out.println("Bot is disabled until API is ready");
    }
}