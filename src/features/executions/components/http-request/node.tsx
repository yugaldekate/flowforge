"use client";

import { memo, useState } from "react";
import { GlobeIcon } from "lucide-react";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { HttpRequestDialog, HttpRequestFormValues } from "./dialog";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";

type HttpRequestNodeData = {
    variableName?: string;
    body?: string;
    endpoint?: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

// Node<HttpRequestNodeData> = configuring the type of data in the Node
type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo(( props: NodeProps<HttpRequestNodeType> ) => {

    const [ dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = "initial";

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: HttpRequestFormValues ) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        variableName: values.variableName,
                        endpoint: values.endpoint,
                        method: values.method,
                        body: values.body,
                    }
                }
            }

            return node;
        }));
    }

    const nodeData = props.data;
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : "Not Configured";

    return (
        <>
            <HttpRequestDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={(formData) => handleSubmit(formData)}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP request"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

HttpRequestNode.displayName = "HttpRequestNode";