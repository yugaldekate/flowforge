"use server";

import { inngest } from "@/inngest/client";
import { discordChannel } from "@/inngest/channels/discord";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

//Docs: https://www.inngest.com/docs/features/realtime
export type DiscordToken = Realtime.Token<typeof discordChannel, ["status"]>;

export async function fetchDiscordRealtimeToken(): Promise<DiscordToken> {

    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: discordChannel(),
        topics: ["status"],
    });

    return token;
}