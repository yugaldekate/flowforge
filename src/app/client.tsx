"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.getUsers.queryOptions());

    return (
        <div>client component : {JSON.stringify(data)} </div>
    )
}