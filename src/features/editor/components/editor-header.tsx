"use client";

import Link from "next/link";
import { SaveIcon } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

import { useSuspenseWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export const EditorSaveButton = ({workflowId} : {workflowId: string}) => {
    return (
        <div className="ml-auto">
            <Button size="sm" onClick={() => {}} disabled={false}>
                <SaveIcon className="size-4"/>
                Save
            </Button>
        </div>
    );
}

export const EditorNameInput = ({workflowId} : {workflowId: string}) => {
    const workflow = useSuspenseWorkflow(workflowId);
    const updateWorkflow = useUpdateWorkflowName();

    const inputRef = useRef<HTMLInputElement>(null);

    const [ name, setName ] = useState(workflow.data.name);
    const [ isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if(workflow.data.name){
            setName(workflow.data.name);
        }
    }, [workflow.data.name]);

    useEffect(() => {
        if(isEditing && inputRef.current){
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if(name === workflow.data.name){
            setIsEditing(false);
            return;
        }

        try {
            await updateWorkflow.mutateAsync({
                id: workflowId, 
                name: name,
            });
        } catch (error) {
            setName(workflow.data.name);
        } finally {
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if( e.key === "Enter"){
            handleSave();
        } else if (e.key === "Escape"){
            setName(workflow.data.name);
            setIsEditing(false);
        }
    };

    if(isEditing){
        return (
            <Input
                ref={inputRef}
                value={name}
                disabled={updateWorkflow.isPending}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="h-7 w-auto min-w-[100px] px-2"
            />
        );
    }

    return (
        <BreadcrumbItem onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-foreground transition-colors">
            {workflow.data.name}
        </BreadcrumbItem>
    );
}

export const EditorBreadcrumbs = ({workflowId} : {workflowId: string}) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/workflows" prefetch>
                            Workflows
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator/>

                <EditorNameInput workflowId={workflowId}/>
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export const EditorHeader = ({workflowId} : {workflowId: string}) => {
    return (
        <header className="flex items-center shrink-0 h-14 gap-2 border-b px-4 bg-background">
            <SidebarTrigger/>
            <div className="flex flex-row justify-between items-center gap-x-4 w-full">
                <EditorBreadcrumbs workflowId={workflowId}/>
                <EditorSaveButton workflowId={workflowId}/>
            </div>
        </header>
    );
}