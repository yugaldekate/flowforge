import { inngest } from "./client";

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import * as Sentry from "@sentry/nextjs";

const openai = createOpenAI();
const anthropic = createAnthropic();
const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ event, step }) => {

        Sentry.logger.info("User triggered test log", { log_source: "inngest-function -> execute" });

        await step.sleep("pretend to work", "5s");

        const { steps: googleSteps } = await step.ai.wrap(
            "gemini-generate-text", // step-name
            generateText,
            {
                model: google("gemini-2.5-flash"),
                system: "You are a helpful assistant.",
                prompt: "What is 2 + 5 ?",
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        );

        const { steps: openaiSteps } = await step.ai.wrap(
            "openai-generate-text", // step-name
            generateText,
            {
                model: openai("gpt-4"),
                system: "You are a helpful assistant.",
                prompt: "What is 2 + 3 ?",
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        );

        const { steps: anthropicSteps } = await step.ai.wrap(
            "anthropic-generate-text", // step-name
            generateText,
            {
                model: anthropic("claude-3-haiku-20240307"),
                system: "You are a helpful assistant.",
                prompt: "What is 2 + 4 ?",
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        );

        return { googleSteps, openaiSteps, anthropicSteps };
    },
);