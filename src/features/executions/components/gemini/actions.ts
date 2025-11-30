"use server";

import { inngest } from "@/inngest/client";
import { geminiChannel } from "@/inngest/channels/gemini";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

//Docs: https://www.inngest.com/docs/features/realtime
export type GeminiToken = Realtime.Token<typeof geminiChannel, ["status"]>;

export async function fetchGeminiRealtimeToken(): Promise<GeminiToken> {

    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: geminiChannel(),
        topics: ["status"],
    });

    return token;
}