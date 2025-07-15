import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-purple-600 bg-purple-200 text-purple-800 hover:bg-purple-300 dark:border-purple-600 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/50",
        destructive:
          "border border-red-600 bg-red-100 text-red-600 hover:bg-red-200 dark:border-red-500 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50",
        outline:
          "border border-purple-400 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200",
        secondary:
          "border border-purple-300 bg-purple-100 text-purple-800 hover:bg-purple-200 hover:border-purple-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
        ghost:
          "border border-transparent bg-transparent text-purple-700 hover:bg-purple-100 dark:text-gray-300 dark:hover:bg-gray-800/50",
        link: "text-purple-700 underline-offset-4 hover:underline dark:text-gray-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

