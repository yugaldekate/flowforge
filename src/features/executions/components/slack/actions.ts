"use server";

import { inngest } from "@/inngest/client";
import { slackChannel } from "@/inngest/channels/slack";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

//Docs: https://www.inngest.com/docs/features/realtime
export type SlackToken = Realtime.Token<typeof slackChannel, ["status"]>;

export async function fetchSlackRealtimeToken(): Promise<SlackToken> {

    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: slackChannel(),
        topics: ["status"],
    });

    return token;
}