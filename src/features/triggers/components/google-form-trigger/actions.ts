"use server";

import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

//Docs: https://www.inngest.com/docs/features/realtime
export type GoogleFormTriggerToken = Realtime.Token<typeof googleFormTriggerChannel, ["status"]>;

export async function fetchGoogleFormTriggerRealtimeToken(): Promise<GoogleFormTriggerToken> {

    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: googleFormTriggerChannel(),
        topics: ["status"],
    });

    return token;
}