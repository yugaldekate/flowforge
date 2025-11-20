"use client";

import { memo } from "react";
import { GlobeIcon } from "lucide-react";

import type { Node, NodeProps } from "@xyflow/react";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";

type HttpRequestNodeData = {
    body?: string;
    endpoint?: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    [key: string]: unknown;
}

// Node<HttpRequestNodeData> = configuring the type of data in the Node
type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo(( props: NodeProps<HttpRequestNodeType> ) => {

    const nodeData = props.data as HttpRequestNodeData;
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : "Not Configured";

    return (
        <>
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP request"
                description={description}
                onSettings={() => {}}
                onDoubleClick={() => {}}
            />
        </>
    );
});

HttpRequestNode.displayName = "HttpRequestNode";