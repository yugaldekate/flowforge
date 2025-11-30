"use client";

import { memo, useState } from "react";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { OpenAiFormValues, OpenAiDialog } from "./dialog";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";

import { fetchOpenAiRealtimeToken } from "./actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";

type OpenAiNodeData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

// Node<OpenAiNodeData> = configuring the type of data in the Node
type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo(( props: NodeProps<OpenAiNodeType> ) => {

    const [ dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAiRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: OpenAiFormValues ) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        variableName: values.variableName,
                        systemPrompt: values.systemPrompt,
                        userPrompt: values.userPrompt,
                    }
                }
            }

            return node;
        }))
    }

    const nodeData = props.data;
    const description = nodeData?.userPrompt ? `gpt-4 : ${nodeData.userPrompt.slice(0, 50)}...` : "Not Configured";

    return (
        <>
            <OpenAiDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={(formData) => handleSubmit(formData)}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/openai.svg"
                name="OpenAI"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

OpenAiNode.displayName = "OpenAiNode";