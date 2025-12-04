"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";

import { Execution } from "@/generated/prisma/client";
import { ExecutionStatus } from "@/generated/prisma/enums";

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, ErrorView, LoadingView } from "@/components/entity-components";

import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";

export const ExecutionsList = () => {
    const executions = useSuspenseExecutions();

    return (
        <EntityList
            items={executions.data.items}
            getKey={(execution) => execution.id}
            renderItem={(execution) => <ExecutionItem data={execution}/>}
            emptyView={<ExecutionsEmpty/>}
        />
    );
}

export const ExecutionsHeader = () => {

    return (
        <EntityHeader
            title="Executions"
            description="View your workflow executions history"
        />
    );
}

export const ExecutionsPagination = () => {
    const executions = useSuspenseExecutions();
    const [ params, setParams ] = useExecutionsParams();

    return (
        <EntityPagination
            page={executions.data.page}
            totalPages={executions.data.totalPages}
            onPageChange={ (page) => setParams({...params, page}) }
            disabled={executions.isFetching}
        />
    );
}

export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<ExecutionsHeader />}
            pagination={<ExecutionsPagination/>}
        >
            {children}
        </EntityContainer>
    );
}

export const ExecutionsLoading = () => {
    return (
        <LoadingView message="Loading executions..."/>
    );
}

export const ExecutionsError = () => {
    return (
        <ErrorView message="Error loading executions"/>
    );
}

export const ExecutionsEmpty = () => {

    return (
        <EmptyView
            message="You haven't any executions yet. Get started by running your first workflow."
        />
    );
}

const getStatusIcon = (status: ExecutionStatus) => {
    switch(status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-600"/>;
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-600 animate-spin"/>;
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600"/>;
        default:
            return <ClockIcon className="size-5 text-muted-foreground"/>;
    }
}

const formatExecutionStatus = (status: ExecutionStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

export const ExecutionItem = ({ data }: {data: Execution & { workflow : { id: string, name: string } } }) => {

    const duration = data.completedAt 
        ? Math.round(new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000 
        : null;

    const subtitle = (
        <>
            <span className="font-semibold">{data.workflow.name}</span>
            {" "} &bull; Started{" "}
            {formatDistanceToNow(data.startedAt, {addSuffix: true})}
            {duration !== null && <> {" "} &bull; Took {duration}s </>}
        </>
    );

    return (
        <EntityItem
            href={`/executions/${data.id}`}
            title={formatExecutionStatus(data.status)}
            subtitle={subtitle}
            image={
                <div className="flex justify-center items-center size-8">
                    {getStatusIcon(data.status)}
                </div>
            }
        />
    );
}