"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { memo, type ReactNode } from "react";

import { NodeProps, Position } from "@xyflow/react";

import { WorkflowNode } from "@/components/workflow-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";

interface BaseTriggerNodeProps extends NodeProps {
    name: string,
    icon: LucideIcon | string,
    children?: ReactNode,
    description?: string,
    // status?: NodeStatus,
    onSettings?: () => void,
    onDoubleClick?: () => void,
}


export const BaseTriggerNode = memo(({ id, name, icon: Icon, children, description, onSettings, onDoubleClick}: BaseTriggerNodeProps) => {
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
            <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                <BaseNodeContent>
                    {typeof Icon === "string" ? (
                        <Image src={Icon} alt={name} width={16} height={16}/>
                    ) : (
                        <Icon className="size-4 text-muted-foreground"/>
                    )}

                    {children}
                    
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

BaseTriggerNode.displayName = "BaseTriggerNode";