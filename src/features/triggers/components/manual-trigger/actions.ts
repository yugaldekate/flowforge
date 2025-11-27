"use server";

import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

//Docs: https://www.inngest.com/docs/features/realtime
export type ManualTriggerToken = Realtime.Token<typeof manualTriggerChannel, ["status"]>;

export async function fetchManualTriggerRealtimeToken(): Promise<ManualTriggerToken> {

    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: manualTriggerChannel(),
        topics: ["status"],
    });

    return token;
}