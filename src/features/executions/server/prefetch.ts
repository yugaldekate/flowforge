import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.executions.getMany>;

// Function to prefetch all executions on the server
export const prefetchExecutions = (params: Input) => {
    return prefetch(trpc.executions.getMany.queryOptions(params));
}

// Function to prefetch a single execution on the server
export const prefetchExecution = (id: string) => {
    return prefetch(trpc.executions.getOne.queryOptions({id}));
}