import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { openAiChannel } from "@/inngest/channels/openai";

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

type OpenAiData = {
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
export const openAiExecutor: NodeExecutor<OpenAiData> = async ({ data, nodeId, context, step, publish}) => {
    
    await publish(openAiChannel()
        .status({
            nodeId: nodeId,
            status: "loading",
        })
    );

    if(!data.variableName){
        await publish(openAiChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("OpenAi node: Variable name not configured")
    }

    if(!data.userPrompt){
        await publish(openAiChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("OpenAi node: User prompt is missing")
    }

    // TODO: Throw if credential is missing

    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)({ context }) : "You are a helpful assistant.";

    const userPrompt = Handlebars.compile(data.userPrompt)({ context });

    // TODO: Fetch credential that user selected for OpenAi
    const credentialValue = process.env.OPENAI_API_KEY!;

    const openai = createOpenAI({
        apiKey: credentialValue,
    });

    try {
        const { steps: openaiSteps } = await step.ai.wrap(
            "openai-generate-text", // step-name
            generateText,
            {
                model: openai("gpt-4"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                }
            }
        );

        const text = openaiSteps[0].content[0].type === "text" ? openaiSteps[0].content[0].text : "";

        await publish(openAiChannel()
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
        await publish(openAiChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw error;
    }
}