import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { discordChannel } from "@/inngest/channels/discord";
import ky from "ky";

type DiscordData = {
    variableName?: string;
    userName?: string;
    content?: string;
    webhookUrl?: string;
}

Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);

    return safeString;
});

// context is the previous node data
export const discordExecutor: NodeExecutor<DiscordData> = async ({ data, nodeId, context, step, publish}) => {
    
    await publish(discordChannel()
        .status({
            nodeId: nodeId,
            status: "loading",
        })
    );
    
    if(!data.content){
        await publish(discordChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("Discord node: Message content is missing");
    }

    const rawContent = Handlebars.compile(data.content)({ context });
    const content = decode(rawContent);

    const userName = data.userName ? decode(Handlebars.compile(data.userName)({ context })) : undefined;

    try {
        const result = await step.run("discord-webhook" , async () => {
            if(!data.webhookUrl){
                await publish(discordChannel()
                    .status({
                        nodeId: nodeId,
                        status: "error",
                    })
                );

                throw new NonRetriableError("Discord node: Webhook URL is required");
            }

            if(!data.variableName){
                await publish(discordChannel()
                    .status({
                        nodeId: nodeId,
                        status: "error",
                    })
                );

                throw new NonRetriableError("Discord node: Variable name not configured");
            }

            await ky.post(data.webhookUrl! , {
                json: {
                    userName: userName,
                    content: content.slice(0, 2000) //Discord's maximum message length 
                }
            });

            return {
                ...context,
                [data.variableName] : {
                    messageContent: content.slice(0, 2000)
                },
            }    
        });

        await publish(discordChannel()
            .status({
                nodeId: nodeId,
                status: "success",
            })
        );

        return result;
        
    } catch (error) {
        await publish(discordChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw error;
    }
}