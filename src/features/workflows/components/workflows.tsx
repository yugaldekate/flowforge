"use client";

import { useRouter } from "next/navigation";

import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components";

import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();

    return (
        <div className="flex-1 flex justify-center items-center">
            <p>
                {JSON.stringify(workflows.data, null, 2)}
            </p>
        </div>
    )
}

export const WorkFlowsSearch = () => {
    const [ params, setParams ] = useWorkflowsParams();

    // (searchValue = localSearch and onSearchChange = setLocalSearch) present inside useState inside useEntitySearch
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    });

    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search workflows"
        />
    );
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const router = useRouter();

    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                handleError(error);
            },
        });
    }

    return (
        <>
            {modal}
            <EntityHeader
                title="Workflows"
                description="Create and manage you workflows"
                newButtonLabel="New Workflow"
                disabled={disabled}
                onNew={handleCreate}
                isCreating={createWorkflow.isPending}
            />
        </>
    )
}

export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [ params, setParams ] = useWorkflowsParams();

    return (
        <EntityPagination
            page={workflows.data.page}
            totalPages={workflows.data.totalPages}
            onPageChange={ (page) => setParams({...params, page}) }
            disabled={workflows.isFetching}

        />
    );
}

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkFlowsSearch/>}
            pagination={<WorkflowsPagination/>}
        >
            {children}
        </EntityContainer>
    );
}