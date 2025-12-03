import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertTriangleIcon, Loader2Icon, MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle, } from "./ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel?: string;
    disabled?: boolean;
    isCreating?: boolean;
} & (
    | { onNew : () => void; newButtonHref?: never } // If onNew is provided, newButtonHref must not be provided
    | { newButtonHref: string; onNew?: never } // If newButtonHref is provided, onNew must not be provided
    | { onNew?: never; newButtonHref?: never } // Neither onNew nor newButtonHref is provided
)

export const EntityHeader = ({ title, description, newButtonLabel, onNew, newButtonHref, disabled, isCreating }: EntityHeaderProps) => {
    return (
        <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-semibold">
                    {title}
                </h1>
                {description && (
                    <p className="text-xs md:text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {(onNew && !newButtonHref) && (
                <Button disabled={disabled || isCreating} onClick={onNew} size="sm" >
                    <PlusIcon className="size-4"/>
                    {newButtonLabel}
                </Button>
            )}
            {(newButtonHref && !onNew) && (
                <Button size="sm" asChild>
                    <Link href={newButtonHref} prefetch>
                        <PlusIcon className="size-4"/>
                        {newButtonLabel}
                    </Link>
                </Button>
            )}
        </div>
    );
}

interface EntityContainerProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    search?: React.ReactNode;
    pagination?: React.ReactNode;
};

export const EntityContainer = ({ header, search, pagination, children }: EntityContainerProps) => {
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="flex flex-col w-full h-full gap-y-8 mx-auto max-w-7xl">
                {header}
                <div className="flex flex-col gap-y-4 h-full">
                    {search}
                    {children}
                </div>
                {pagination}
            </div>
        </div>
    );
}

interface EntitySearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export const EntitySearch = ({ value, onChange, placeholder= "Search" }: EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon 
                className="absolute top-1/2 -translate-y-1/2 size-3.5 left-2 text-muted-foreground"
            />
            <Input
                className="pl-8 max-w-[200px] bg-background shadow-none border-border"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

interface EntityPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export const EntityPagination = ({ page, totalPages, onPageChange, disabled}: EntityPaginationProps) => {
    return (
        <div className="flex justify-between items-center gap-x-2 w-full">
            <div className="flex-1 text-sm text-muted-foreground">
                Page {page} of {totalPages || 1}
            </div>
            <div className="flex justify-end items-center space-x-2 py-4">
                <Button
                    disabled={ page === 1 || disabled}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                >
                    Previous
                </Button>
                <Button
                    disabled={ page === totalPages || totalPages === 0 || disabled}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

interface StateViewProps {
    message?: string;
}

export const LoadingView = ({ message }: StateViewProps) => {
    return (
        <div className="flex-1 flex flex-col justify-center items-center h-full gap-y-4">
            <Loader2Icon className="size-6 animate-spin text-primary"/>
                {!!message && (
                    <p className="text-sm text-muted-foreground">
                        {message}
                    </p>
                )}
        </div>
    );
}

export const ErrorView = ({ message }: StateViewProps) => {
    return (
        <div className="flex-1 flex flex-col justify-center items-center h-full gap-y-4">
            <AlertTriangleIcon className="size-6 text-primary"/>
                {!!message && (
                    <p className="text-sm text-muted-foreground">
                        {message}
                    </p>
                )}
        </div>
    );
}

interface EmptyViewProps extends StateViewProps {
    onNew?: () => void;
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
    return (
        <Empty className="border border-dashed bg-white">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PackageOpenIcon/>
                </EmptyMedia>
                <EmptyTitle>No items</EmptyTitle>
                {!!message && (
                    <EmptyDescription>{message}</EmptyDescription>
                )}
            </EmptyHeader>

            {!!onNew && (
                <EmptyContent>
                    <Button onClick={onNew}>
                        Add data
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    );
}

interface EntityListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getKey?: (item: T, index: number) => number | string;
    emptyView?: React.ReactNode;
    className?: string;
}

export const EntityList = <T,>({ items, renderItem, getKey, emptyView, className }: EntityListProps<T>) => {
    if(items.length === 0 && emptyView){
        return (
            <div className="flex-1 flex justify-center items-center">
                <div className="mx-auto max-w-sm">
                    {emptyView}
                </div>
            </div>
        );
    };

    return (
        <div className={cn("flex flex-col gap-y-4", className)}>
            {items.map((item, index) => (
                <div key={ getKey ? getKey(item, index) : index }>
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    );
}

interface EntityItemProps {
    href: string;
    title: string;
    subtitle?: React.ReactNode;
    image?: React.ReactNode;
    actions?: React.ReactNode;
    onRemove?: () => void | Promise<void>;
    isRemoving?: boolean;
    className?: string;
}

export const EntityItem = ({ href, title, subtitle, image, actions, onRemove, isRemoving, className }: EntityItemProps) => {

    const handleRemove = async(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if(isRemoving) return;

        if(onRemove){
            await onRemove();
        }
    }

    return (
        <Link href={href} prefetch>
            <Card className={cn("p-4 shadow-none hover:shadow cursor-pointer", isRemoving && "opacity-50 cursor-not-allowed", className)}>
                <CardContent className="flex flex-row justify-between items-center p-0">
                    <div className="flex items-center gap-3">
                        {image}
                        <div>
                            <CardTitle className="text-base font-medium">
                                {title}
                            </CardTitle>
                            {!!subtitle && (
                                <CardDescription className="text-xs">
                                    {subtitle}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                    {(actions || onRemove) && (
                        <div className="flex items-center gap-4">
                            {actions}
                            {onRemove && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                                            <MoreVerticalIcon className="size-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenuItem onClick={handleRemove} variant="destructive">
                                            <TrashIcon className="size-4 text-destructive"/>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}