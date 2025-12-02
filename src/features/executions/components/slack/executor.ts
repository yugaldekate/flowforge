import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { slackChannel } from "@/inngest/channels/slack";
import ky from "ky";

type SlackData = {
    variableName?: string;
    content?: string;
    webhookUrl?: string;
}

Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);

    return safeString;
});

// context is the previous node data
export const slackExecutor: NodeExecutor<SlackData> = async ({ data, nodeId, context, step, publish}) => {
    
    await publish(slackChannel()
        .status({
            nodeId: nodeId,
            status: "loading",
        })
    );

    if(!data.content){
        await publish(slackChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("Slack node: Message content is missing");
    }

    const rawContent = Handlebars.compile(data.content)({ context });
    const content = decode(rawContent);

    try {
        const result = await step.run("slack-webhook" , async () => {
            if(!data.webhookUrl){
                await publish(slackChannel()
                    .status({
                        nodeId: nodeId,
                        status: "error",
                    })
                );

                throw new NonRetriableError("Slack node: Webhook URL is required");
            }
            
            if(!data.variableName){
                await publish(slackChannel()
                    .status({
                        nodeId: nodeId,
                        status: "error",
                    })
                );

                throw new NonRetriableError("Slack node: Variable name not configured");
            }

            await ky.post(data.webhookUrl! , {
                json: {
                    content: content, // The key depends on wokflow config
                }
            });

            return {
                ...context,
                [data.variableName] : {
                    messageContent: content,
                },
            }    
        });

        await publish(slackChannel()
            .status({
                nodeId: nodeId,
                status: "success",
            })
        );

        return result;
        
    } catch (error) {
        await publish(slackChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw error;
    }
}