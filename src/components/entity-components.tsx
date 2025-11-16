import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";

type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel: string;
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

type EntityContainerProps = {
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

interface EntitiySearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export const EntitySearch = ({ value, onChange, placeholder= "Search" }: EntitiySearchProps) => {
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