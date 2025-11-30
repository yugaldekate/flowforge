import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";

import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

type GeminiData = {
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
export const geminiExecutor: NodeExecutor<GeminiData> = async ({ data, nodeId, context, step, publish}) => {
    
    await publish(geminiChannel()
        .status({
            nodeId: nodeId,
            status: "loading",
        })
    );

    if(!data.variableName){
        await publish(geminiChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("Gemini node: Variable name not configured")
    }

    if(!data.userPrompt){
        await publish(geminiChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("Gemini node: User prompt is missing")
    }

    // TODO: Throw if credential is missing

    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)({ context }) : "You are a helpful assistant.";

    const userPrompt = Handlebars.compile(data.userPrompt)({ context });

    // TODO: Fetch credential that user selected for Gemini
    const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;

    const google = createGoogleGenerativeAI({
        apiKey: credentialValue,
    });

    try {
        const { steps: googleSteps } = await step.ai.wrap(
            "gemini-generate-text", // step-name
            generateText,
            {
                model: google("gemini-2.0-flash"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                }
            }
        );

        const text = googleSteps[0].content[0].type === "text" ? googleSteps[0].content[0].text : "";

        await publish(geminiChannel()
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
        await publish(geminiChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw error;
    }
}