"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { formatDistanceToNow } from "date-fns";

import { Credential } from "@/generated/prisma/client";
import { CredentialType } from "@/generated/prisma/enums";

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";

import { useEntitySearch } from "@/hooks/use-entity-search";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials();

    return (
        <EntityList
            items={credentials.data.items}
            getKey={(credential) => credential.id}
            renderItem={(credential) => <CredentialItem data={credential}/>}
            emptyView={<CredentialsEmpty/>}
        />
    )
}

export const CredentialsSearch = () => {
    const [ params, setParams ] = useCredentialsParams();

    // (searchValue = localSearch and onSearchChange = setLocalSearch) present inside useState inside useEntitySearch
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    });

    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search credentials"
        />
    );
}

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {

    return (
        <EntityHeader
            title="Credentials"
            description="Create and manage your credentials"
            newButtonLabel="New Credential"
            newButtonHref="/credentials/new"
            disabled={disabled}
        />
    )
}

export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials();
    const [ params, setParams ] = useCredentialsParams();

    return (
        <EntityPagination
            page={credentials.data.page}
            totalPages={credentials.data.totalPages}
            onPageChange={ (page) => setParams({...params, page}) }
            disabled={credentials.isFetching}

        />
    );
}

export const CredentialsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<CredentialsHeader />}
            search={<CredentialsSearch/>}
            pagination={<CredentialsPagination/>}
        >
            {children}
        </EntityContainer>
    );
}

export const CredentialsLoading = () => {
    return (
        <LoadingView message="Loading credentials..."/>
    );
}

export const CredentialsError = () => {
    return (
        <ErrorView message="Error loading credentials"/>
    );
}

export const CredentialsEmpty = () => {
    const router = useRouter();

    const handleCreate = () => {
        router.push(`/credentials/new`);  
    };

    return (
        <EmptyView
            message="You haven't created any credentials yet. Get started by creating your first credential."
            onNew={handleCreate}
        />
    );
}

const credentialsLogos: Record<CredentialType, string> = {
    [CredentialType.GEMINI]: "/logos/gemini.svg",
    [CredentialType.OPENAI]: "/logos/openai.svg",
    [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
};

export const CredentialItem = ({ data }: {data: Credential}) => {

    const removeCredential = useRemoveCredential();

    const handleRemove = () => {
        removeCredential.mutate({ id: data.id });
    };

    const logo = credentialsLogos[data.type] || "/logos/openai.svg";

    return (
        <EntityItem
            href={`/credentials/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true})}{" "}
                    &bull; Created {" "}
                    {formatDistanceToNow(data.createdAt, { addSuffix: true})}
                </>
            }
            image={
                <div className="flex justify-center items-center size-8">
                    <Image
                        src={logo}
                        alt={`${data.type} logo`}
                        width={20}
                        height={20}
                    />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    );
}