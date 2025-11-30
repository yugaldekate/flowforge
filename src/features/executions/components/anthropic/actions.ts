"use server";

import { inngest } from "@/inngest/client";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

//Docs: https://www.inngest.com/docs/features/realtime
export type AnthropicToken = Realtime.Token<typeof anthropicChannel, ["status"]>;

export async function fetchAnthropicRealtimeToken(): Promise<AnthropicToken> {

    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: anthropicChannel(),
        topics: ["status"],
    });

    return token;
}