import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { anthropicChannel } from "@/inngest/channels/anthropic";

import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

type AnthropicData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);

    return safeString;
});

// context is the previous node data
export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({ data, nodeId, context, step, publish}) => {
    
    await publish(anthropicChannel()
        .status({
            nodeId: nodeId,
            status: "loading",
        })
    );

    if(!data.variableName){
        await publish(anthropicChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("Anthropic node: Variable name not configured")
    }

    if(!data.userPrompt){
        await publish(anthropicChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("Anthropic node: User prompt is missing")
    }

    // TODO: Throw if credential is missing

    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)({ context }) : "You are a helpful assistant.";

    const userPrompt = Handlebars.compile(data.userPrompt)({ context });

    // TODO: Fetch credential that user selected for Anthropic
    const credentialValue = process.env.ANTHROPIC_API_KEY!;

    const anthropic = createAnthropic({
        apiKey: credentialValue,
    });

    try {
        const { steps: anthropicSteps } = await step.ai.wrap(
            "anthropic-generate-text", // step-name
            generateText,
            {
                model: anthropic("claude-3-haiku-20240307"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                }
            }
        );

        const text = anthropicSteps[0].content[0].type === "text" ? anthropicSteps[0].content[0].text : "";

        await publish(anthropicChannel()
            .status({
                nodeId: nodeId,
                status: "success",
            })
        );

        return {
            ...context,
            [data.variableName] : {
                text: text,
            },
        }    
    
    } catch (error) {
        await publish(anthropicChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw error;
    }
}