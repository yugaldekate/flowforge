import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.credentials.getMany>;

// Function to prefetch all credentials on the server
export const prefetchCredentials = (params: Input) => {
    return prefetch(trpc.credentials.getMany.queryOptions(params));
}

// Function to prefetch a single credential on the server
export const prefetchCredential = (id: string) => {
    return prefetch(trpc.credentials.getOne.queryOptions({id}));
}