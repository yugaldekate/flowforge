import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card container element that provides default styling and structure for a card UI.
 *
 * Renders a div with `data-slot="card"`, default card classes, and any additional props forwarded to the root element.
 *
 * @param className - Additional CSS class names merged with the component's default classes
 * @returns The rendered card container `div` element
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * Card header section that lays out the title, description, and optional action controls.
 *
 * Renders a div with data-slot="card-header", applies responsive grid, spacing, and border/padding utility classes, and forwards all received div props.
 *
 * @returns The card header container element.
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * Title element for use in Card headers that applies semibold, tight-leading typography.
 *
 * @returns A `div` element with `data-slot="card-title"`, the `leading-none font-semibold` classes, and any provided `className` and other div props applied.
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Renders the card's description container with muted, small text styling.
 *
 * @returns A div element with `data-slot="card-description"` and `text-muted-foreground text-sm` styling that forwards any received div props.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * Renders the card action area positioned at the end of the header grid.
 *
 * Accepts standard div props and applies layout classes along with any additional classes.
 *
 * @param className - Additional CSS classes to merge with the component's layout classes
 * @returns A div element serving as the card action slot with layout classes and received props
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the main content area of a Card.
 *
 * @param className - Additional CSS class names to append to the content container
 * @param props - Additional div attributes to spread onto the content container
 * @returns A div element with `data-slot="card-content"` and horizontal padding
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/**
 * Footer area for a Card component.
 *
 * @param className - Additional CSS classes to append to the footer's class list
 * @returns The footer element for the card
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}