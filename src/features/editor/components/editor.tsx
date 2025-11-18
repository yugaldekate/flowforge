"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const workflow = useSuspenseWorkflow(workflowId);

    return (
        <p>
            {JSON.stringify(workflow.data, null, 2)}
        </p>
    );
}

export const EditorLoading = () => {
    return (
        <LoadingView message="Loading editor..."/>
    );
}

export const EditorError = () => {
    return (
        <ErrorView message="Error loading editor"/>
    );
}