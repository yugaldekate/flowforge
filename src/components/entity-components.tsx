import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

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
                <Button disabled={disabled || isCreating} onClick={onNew} className="sm" >
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