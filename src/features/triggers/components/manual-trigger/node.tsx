"use client";

import { memo, useState } from "react";
import { MousePointerIcon } from "lucide-react";

import type { NodeProps } from "@xyflow/react";

import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo(( props: NodeProps ) => {

    const [ dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = "initial";

    const handleOpenSettings = () => setDialogOpen(true);

    return (
        <>
            <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name="When clicking execute workflow"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

ManualTriggerNode.displayName = "ManualTriggerNode";