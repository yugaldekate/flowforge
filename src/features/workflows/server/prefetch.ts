import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.workflows.getMany>;

// Function to prefetch all workflows on the server
export const prefetchWorkflows = (params: Input) => {
    return prefetch(trpc.workflows.getMany.queryOptions(params));
}