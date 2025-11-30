"use server";

import { inngest } from "@/inngest/client";
import { openAiChannel } from "@/inngest/channels/openai";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

//Docs: https://www.inngest.com/docs/features/realtime
export type OpenAiToken = Realtime.Token<typeof openAiChannel, ["status"]>;

export async function fetchOpenAiRealtimeToken(): Promise<OpenAiToken> {

    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: openAiChannel(),
        topics: ["status"],
    });

    return token;
}