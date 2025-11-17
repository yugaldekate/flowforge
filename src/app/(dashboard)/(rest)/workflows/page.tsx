import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary';

import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { WorkflowsContainer, WorkflowsError, WorkflowsList, WorkflowsLoading } from "@/features/workflows/components/workflows";

import type { SearchParams } from "nuqs/server";
import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";

interface PageProps {
    searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: PageProps) => {

    await requireAuth();

    const params = await workflowsParamsLoader(searchParams);

    prefetchWorkflows(params);

    return (
        <WorkflowsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<WorkflowsError/>}>
                    <Suspense fallback={<WorkflowsLoading/>}>
                        <WorkflowsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowsContainer>
    );
}

export default Page;