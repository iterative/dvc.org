import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utils'

const buttonVariants = cva(
  `inline-flex items-center justify-center font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300`,
  {
    variants: {
      variant: {
        default: `bg-slate-50 text-slate-900 hover:bg-slate-50/90`,
        destructive: `bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90`,
        outline: `border border-solid border-purple bg-transparent text-slate-700 outline-none hover:bg-purple hover:text-white`,
        ghost: `hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50`,
        link: `text-slate-900 underline-offset-4 hover:underline`,
        primary: `bg-purple-700 text-slate-100 hover:bg-purple-600 hover:text-white`,
        secondary: `bg-white/10 text-purple hover:bg-purple-900 hover:text-slate-200`
      },
      size: {
        default: `h-10 px-4 py-2`,
        sm: `h-9 px-3`,
        lg: `h-11 px-8`,
        xl: `h-14 px-8`,
        icon: `h-10 w-10`
      },
      rounded: {
        default: `rounded`,
        sm: `rounded-sm`,
        lg: `rounded-lg`,
        full: `rounded-full`
      }
    },
    defaultVariants: {
      variant: `default`,
      size: `default`,
      rounded: `default`
    }
  }
)

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : `button`
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = `Button`

export { Button, buttonVariants }
