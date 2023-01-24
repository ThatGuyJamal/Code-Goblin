package org.github.thatguyjamal.discord;

import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.dv8tion.jda.api.utils.ChunkingFilter;
import net.dv8tion.jda.api.utils.cache.CacheFlag;
public class Discord {
    public void init() {
        JDABuilder builder = (JDABuilder) JDABuilder.createDefault("OTk4NDEzNTk1NzY1Mzc5MTEy.GHiA3l.J4HAPPnKSjInjavDlx6njVW94_9Gn3_HARRE10")
                .addEventListeners(new ReadyListener())
                .build();

        // Disable cache for member activities (streaming/games/spotify)
        builder.disableCache(CacheFlag.ACTIVITY);

        // Disable parts of the cache
        builder.disableCache(CacheFlag.MEMBER_OVERRIDES, CacheFlag.VOICE_STATE);

        // Disable member chunking on startup
        builder.setChunkingFilter(ChunkingFilter.NONE);

        // Disable presence updates and typing events
        builder.disableIntents(GatewayIntent.GUILD_PRESENCES, GatewayIntent.GUILD_MESSAGE_TYPING);

        // Consider guilds with more than 50 members as "large".
        // Large guilds will only provide online members in their setup and thus reduce bandwidth if chunking is disabled.
        builder.setLargeThreshold(50);

        builder.build();
        System.out.println("Running Discord API");
    }
}
