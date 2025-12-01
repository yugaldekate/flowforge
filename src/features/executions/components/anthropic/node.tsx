"use client";

import { memo, useState } from "react";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { AnthropicDialog, AnthropicFormValues } from "./dialog";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";

import { fetchAnthropicRealtimeToken } from "./actions";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";

type AnthropicNodeData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
    credentialId?: string;
}

// Node<AnthropicNodeData> = configuring the type of data in the Node
type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo(( props: NodeProps<AnthropicNodeType> ) => {

    const [ dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: ANTHROPIC_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchAnthropicRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: AnthropicFormValues ) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        variableName: values.variableName,
                        systemPrompt: values.systemPrompt,
                        userPrompt: values.userPrompt,
                        credentialId: values.credentialId,
                    }
                }
            }

            return node;
        }))
    }

    const nodeData = props.data;
    const description = nodeData?.userPrompt ? `claude-3-haiku-20240307 : ${nodeData.userPrompt.slice(0, 50)}...` : "Not Configured";

    return (
        <>
            <AnthropicDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={(formData) => handleSubmit(formData)}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/anthropic.svg"
                name="Anthropic"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

AnthropicNode.displayName = "AnthropicNode";