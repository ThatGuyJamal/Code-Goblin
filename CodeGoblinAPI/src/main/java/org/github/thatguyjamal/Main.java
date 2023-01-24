package org.github.thatguyjamal;

public class Main {
    public static void main(String[] args) {
        // Create a new instance of the Rest class
        Rest rest = new Rest();

        // Create a new instance of the Discord class
        Discord discord = new Discord();

        // Run the init() method in the Rest class
        rest.init(3030);
        discord.CreateLogMessage("Code Goblin Rest API is online and running!");

        // Run the init() method in the Discord class
         discord.init();
         discord.CreateLogMessage("Code Goblin Discord API is online and running!");
    }
}