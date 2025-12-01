import { Suspense } from "react";
import { SearchParams } from "nuqs";
import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";
import { ErrorBoundary } from "react-error-boundary";

import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";

import { CredentialsContainer, CredentialsError, CredentialsList, CredentialsLoading } from "@/features/credentials/components/credentials";

interface PageProps {
    searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: PageProps) => {

    await requireAuth();

    const params = await credentialsParamsLoader(searchParams);
    
    prefetchCredentials(params);

    return (
        <CredentialsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<CredentialsError/>}>
                    <Suspense fallback={<CredentialsLoading/>}>
                        <CredentialsList/>
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </CredentialsContainer>
    )
}

export default Page;