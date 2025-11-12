"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions());
      toast.success("Workflow creation queued");
    }},
  ));

  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center">
      Protected server component
      {JSON.stringify(data)}

      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Workflows
      </Button>
    </div>
  )
}

export default Page;