"use server";

import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { httpRequestChannel } from "@/inngest/channels/http-request";

//Docs: https://www.inngest.com/docs/features/realtime
export type HttpRequestToken = Realtime.Token<typeof httpRequestChannel, ["status"]>;

export async function fetchHttpRequestRealtimeToken(): Promise<HttpRequestToken> {

    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: httpRequestChannel(),
        topics: ["status"],
    });

    return token;
}