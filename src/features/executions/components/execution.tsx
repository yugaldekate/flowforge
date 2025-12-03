"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";

import { formatDistanceToNow } from "date-fns";

import { useSuspenseExecution } from "@/features/executions/hooks/use-executions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { ExecutionStatus } from "@/generated/prisma/enums";

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

export const ExecutionView = ({executionId} : {executionId: string}) => {
    const execution = useSuspenseExecution(executionId);

    const [showStackTrace, setShowStackTrace] = useState(false);

    const duration = execution.data.completedAt 
        ? Math.round(new Date(execution.data.completedAt).getTime() - new Date(execution.data.startedAt).getTime()) / 1000 
        : null;

    return (
        <Card className="shadow-none">
            <CardHeader>
                <div className="flex items-center gap-3">
                    {getStatusIcon(execution.data.status)}
                    <div>
                        <CardTitle>
                            {formatExecutionStatus(execution.data.status)}
                        </CardTitle>
                        <CardDescription>
                            Execution for{execution.data.workflow.name}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="gird grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Workflow
                        </p>
                        <Link
                            prefetch
                            className="text-sm hover:underline text-primary"
                            href={`/workflows/${execution.data.workflow.id}`}
                        >
                            {execution.data.workflow.name}
                        </Link>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Status
                        </p>
                        <p className="text-sm">
                            {formatExecutionStatus(execution.data.status)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Started
                        </p>
                        <p className="text-sm">
                            {formatDistanceToNow(execution.data.startedAt, { addSuffix: true })}
                        </p>
                    </div>

                    { execution.data.completedAt ? (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Completed
                                </p>
                                <p className="text-sm">
                                    {formatDistanceToNow(execution.data.completedAt, { addSuffix: true })}
                                </p>
                            </div>
                        )
                        : null
                    }

                    { duration !== null ? (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Duration
                                </p>
                                <p className="text-sm">
                                    {duration}s
                                </p>
                            </div>
                        )
                        : null
                    }

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Event ID
                        </p>
                        <p className="text-sm">
                            {execution.data.inngestEventId}
                        </p>
                    </div>
                </div>

                { execution.data.error && (
                    <div className="mt-5 p-4 bg-red-50 rounded-md space-y-3">
                        <div>
                            <p className="text-sm font-medium text-red-900 mb-2">
                                Error
                            </p>
                            <p className="text-sm font-mono text-red-800">
                                {execution.data.error}
                            </p>
                        </div>
                    </div>
                )}
                
                { execution.data.errorStack && (
                    <Collapsible
                        open={showStackTrace}
                        onOpenChange={setShowStackTrace}
                    >
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-900 hover:bg-red-100"
                            >
                                {showStackTrace ? "Hide Stack Trace" : "Show Stack Trace"}
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                            <pre className="text-xs font-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100 rounded">
                                {execution.data.errorStack}
                            </pre>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                { execution.data.output && (
                    <div className="mt-6 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-2">
                            <pre className="text-xs font-mono overflow-auto">
                                {JSON.stringify(execution.data.output, null, 2)}
                            </pre>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );    
}