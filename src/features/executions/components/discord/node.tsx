"use client";

import { memo, useState } from "react";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { DiscordFormValues, DiscordDialog } from "./dialog";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";

import { fetchDiscordRealtimeToken } from "./actions";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";

type DiscordNodeData = {
    variableName?: string;
    userName?: string;
    content?: string;
    webhookUrl?: string;
}

// Node<DiscordNodeData> = configuring the type of data in the Node
type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo(( props: NodeProps<DiscordNodeType> ) => {

    const [ dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: DISCORD_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchDiscordRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: DiscordFormValues ) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        variableName: values.variableName,
                        userName: values.userName,
                        content: values.content,
                        webhookUrl: values.webhookUrl,
                    }
                }
            }

            return node;
        }))
    }

    const nodeData = props.data;
    const description = nodeData?.content ? `Send : ${nodeData.content.slice(0, 50)}...` : "Not Configured";

    return (
        <>
            <DiscordDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={(formData) => handleSubmit(formData)}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/discord.svg"
                name="Discord"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

DiscordNode.displayName = "DiscordNode";