import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Renders a centered empty-state container.
 *
 * @param className - Additional CSS classes merged into the container's class list.
 * @param props - Other HTML div attributes forwarded to the root element.
 * @returns A div element configured as an empty-state wrapper (includes data-slot="empty" and preset layout/styling classes).
 */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
        className
      )}
      {...props}
    />
  )
}

/**
 * Header region for an empty state layout.
 *
 * Renders a div with data-slot="empty-header" that centers and stacks its contents; accepts standard div props and merges any provided `className`.
 *
 * @returns The header div element for an empty state, with `data-slot="empty-header"` and composed layout classes.
 */
function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Renders the media/icon container for an empty state with variant-driven styling.
 *
 * Accepts a `variant` to select visual style and forwards any other div props to the rendered element.
 *
 * @param variant - Visual variant for the media area; `"default"` (transparent container) or `"icon"` (muted background, sized icon container)
 * @returns A div element used as the empty state's media/icon area
 */
function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

/**
 * Renders the title area for an empty state.
 *
 * Merges default typography classes with any provided `className` and forwards other div attributes.
 *
 * @param className - Additional CSS classes to apply to the title container
 * @param props - Additional props forwarded to the underlying div element
 * @returns A div element representing the empty state title
 */
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  )
}

/**
 * Renders the description area for an empty state.
 *
 * @param className - Additional class names to apply to the description container
 * @param props - Additional props forwarded to the rendered element
 * @returns A JSX element representing the empty-state description container
 */
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the content area for an empty-state layout with centered, vertically stacked items and balanced text.
 *
 * @returns A div element that serves as the empty state's content container, including default layout and spacing classes.
 */
function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}