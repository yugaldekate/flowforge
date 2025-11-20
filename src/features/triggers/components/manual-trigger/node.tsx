"use client";

import { memo } from "react";
import { MousePointerIcon } from "lucide-react";

import type { NodeProps } from "@xyflow/react";

import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";

export const ManualTriggerNode = memo(( props: NodeProps ) => {

    return (
        <>
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name="When clicking execute workflow"
                // status={nodeStatus} TODO:
                // onSettings={handleOpenSettings} TODO:
                // onDoubleClick={handleOpenSettings} TODO:
            />
        </>
    );
});

ManualTriggerNode.displayName = "ManualTriggerNode";