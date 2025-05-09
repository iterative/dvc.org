import * as React from 'react'

import { cn } from '../../utils'

export type ISelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const Select = React.forwardRef<HTMLSelectElement, ISelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={cn(
          'h-9 w-full whitespace-nowrap',
          'flex  items-center justify-between',
          'px-2 py-1',
          'rounded-md border border-slate-200 bg-transparent text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Select.displayName = 'Select'

export { Select }
