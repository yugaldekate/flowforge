"use client";

import { memo, useState } from "react";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { SlackFormValues, SlackDialog } from "./dialog";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";

import { fetchSlackRealtimeToken } from "./actions";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";

type SlackNodeData = {
    variableName?: string;
    content?: string;
    webhookUrl?: string;
}

// Node<SlackNodeData> = configuring the type of data in the Node
type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo(( props: NodeProps<SlackNodeType> ) => {

    const [ dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: SLACK_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchSlackRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: SlackFormValues ) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        variableName: values.variableName,
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
            <SlackDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={(formData) => handleSubmit(formData)}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/slack.svg"
                name="Slack"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

SlackNode.displayName = "SlackNode";