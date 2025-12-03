import { Suspense } from "react";
import { SearchParams } from "nuqs";
import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";
import { ErrorBoundary } from "react-error-boundary";

import { prefetchExecutions } from "@/features/executions/server/prefetch";

import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { ExecutionsContainer, ExecutionsError, ExecutionsLoading, ExecutionsList } from "@/features/executions/components/executions";

interface PageProps {
    searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: PageProps) => {

    await requireAuth();

    const params = await executionsParamsLoader(searchParams);
    
    prefetchExecutions(params);

    return (
        <ExecutionsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<ExecutionsError/>}>
                    <Suspense fallback={<ExecutionsLoading/>}>
                        <ExecutionsList/>
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </ExecutionsContainer>
    );
}

export default Page;