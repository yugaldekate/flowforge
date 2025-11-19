"use client";

import { memo } from "react";
import { PlusIcon } from "lucide-react";
import type { NodeProps } from "@xyflow/react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";

export const InitialNode = memo((props: NodeProps) => {
    return (
        <WorkflowNode showToolbar={false}>
            <PlaceholderNode {...props} onClick={() => {}}>
                <div className="flex justify-center items-center cursor-pointer">
                    <PlusIcon className="size-4"/>
                </div>
            </PlaceholderNode>
        </WorkflowNode>
    );
});

InitialNode.displayName = "InitialNode";