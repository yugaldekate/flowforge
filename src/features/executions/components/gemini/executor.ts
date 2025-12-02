import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";

import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import prisma from "@/lib/db";

type GeminiData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
    credentialId?: string;
}

Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);

    return safeString;
});

// context is the previous node data
export const geminiExecutor: NodeExecutor<GeminiData> = async ({ data, nodeId, userId, context, step, publish}) => {
    
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

        throw new NonRetriableError("Gemini node: Variable name not configured");
    }

    if(!data.credentialId){
        await publish(geminiChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("Gemini node: Credential is required");
    }

    if(!data.userPrompt){
        await publish(geminiChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("Gemini node: User prompt is missing");
    }

    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)({ context }) : "You are a helpful assistant.";

    const userPrompt = Handlebars.compile(data.userPrompt)({ context });

    const credential = await step.run("get-gemini-credential", async () => {
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId,
                userId: userId,
            },
        });
    });

    if(!credential){
        await publish(geminiChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );
        
        throw new NonRetriableError("Gemini node: Credential not found");
    }

    const google = createGoogleGenerativeAI({
        apiKey: credential.value,
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