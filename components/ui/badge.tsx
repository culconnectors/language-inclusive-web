/**
 * Badge Component
 *
 * A versatile badge component that can be used to display status, labels, or small pieces of information.
 * Supports multiple variants and can be customized with additional classes.
 *
 * @module components/ui/badge
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Defines the visual variants for the badge component
 * @constant
 */
const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

/**
 * Props interface for the Badge component
 * @interface BadgeProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @extends {VariantProps<typeof badgeVariants>}
 */
export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

/**
 * Badge component for displaying status or labels
 *
 * @param {BadgeProps} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.variant] - Visual variant of the badge
 * @returns {JSX.Element} Rendered badge component
 *
 * @example
 * // Default badge
 * <Badge>New</Badge>
 *
 * @example
 * // Secondary variant
 * <Badge variant="secondary">Draft</Badge>
 *
 * @example
 * // Destructive variant with custom class
 * <Badge variant="destructive" className="my-2">Error</Badge>
 */
function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
