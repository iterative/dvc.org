import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils'

export type IButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          `inline-flex items-center justify-center whitespace-nowrap`,
          'h-9 py-2 px-4',
          `text-sm font-semibold`,
          `text-gray-100 bg-gray-800 hover:text-white hover:bg-gray-950`,
          `rounded shadow-sm`,
          `transition-colors`,
          `focus:outline-none focus:ring-1`,
          `disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export default Button
