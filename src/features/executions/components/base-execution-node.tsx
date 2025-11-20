"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { memo, type ReactNode } from "react";

import { NodeProps, Position } from "@xyflow/react";

import { WorkflowNode } from "@/components/workflow-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";

interface BaseExecutionNodeProps extends NodeProps {
    name: string,
    icon: LucideIcon | string,
    children?: ReactNode,
    description?: string,
    // status?: NodeStatus,
    onSettings?: () => void,
    onDoubleClick?: () => void,
}


export const BaseExecutionNode = memo(({ id, name, icon: Icon, children, description, onSettings, onDoubleClick}: BaseExecutionNodeProps) => {
    // TODO: Add delete method
    const handleDelete = () => {};

    return (
        <WorkflowNode 
            name={name} 
            description={description} 
            onDelete={handleDelete} 
            onSettings={onSettings}
        >
            {/* TODO: Wrap within NodeStatusIndiactor */}
            <BaseNode onDoubleClick={onDoubleClick}>
                <BaseNodeContent>
                    {typeof Icon === "string" ? (
                        <Image src={Icon} alt={name} width={16} height={16}/>
                    ) : (
                        <Icon className="size-4 text-muted-foreground"/>
                    )}

                    {children}
                    
                    <BaseHandle
                        id="target-1"
                        type="target"
                        position={Position.Left}
                    />
                    <BaseHandle
                        id="source-1"
                        type="source"
                        position={Position.Right}
                    />
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    );
});

BaseExecutionNode.displayName = "BaseExecutionNode";