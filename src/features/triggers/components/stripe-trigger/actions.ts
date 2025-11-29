"use server";

import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

//Docs: https://www.inngest.com/docs/features/realtime
export type StripeTriggerToken = Realtime.Token<typeof stripeTriggerChannel, ["status"]>;

export async function fetchStripeTriggerRealtimeToken(): Promise<StripeTriggerToken> {

    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: stripeTriggerChannel(),
        topics: ["status"],
    });

    return token;
}