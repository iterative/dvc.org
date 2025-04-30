import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utils'

type Components = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'

const typographyVariants = cva(`font-sans font-normal text-zinc-900`, {
  variants: {
    variant: {
      h1: `mb-4 mt-0 text-[clamp(2.125rem,5vw,3.75rem)] font-bold leading-tight md:mb-6 lg:mb-8`,
      h2: `mb-4 mt-0 text-[clamp(1.5rem,4vw,3rem)] font-bold leading-tight tracking-tight md:mb-6 lg:mb-8`,
      h3: `mb-4 mt-0 text-[clamp(1.25rem,3vw,2rem)] font-semibold leading-tight tracking-tight md:mb-6 lg:mb-8`,
      h4: `mb-4 mt-0 text-[clamp(1.125rem,2.5vw,1.5rem)] font-semibold leading-tight tracking-tight md:mb-6 lg:mb-8`,
      subtitle: `mb-4 mt-0 leading-normal tracking-normal text-gray-300 md:mb-6 md:leading-relaxed lg:mb-8`,
      body: `mb-4 mt-0 leading-normal tracking-normal md:mb-6 lg:mb-8 lg:leading-relaxed lg:tracking-wide`,
      p: `mb-4 mt-0 text-base leading-6 tracking-tight md:mb-6 lg:mb-8`,
      span: `text-base leading-6 tracking-tight`
    },
    theme: {
      gray: `text-gray-400`,
      lightGray: `text-gray-300`,
      lighterGray: `text-gray-200`,
      light: `text-gray-100`,
      white: `text-white`,
      black: `text-black`
    },
    margin: {
      none: `mb-0 md:mb-0 lg:mb-0`
    },
    size: {
      small: `text-sm md:text-base lg:text-lg`,
      medium: `text-base md:text-lg lg:text-xl`,
      large: `text-lg md:text-xl lg:text-2xl`
    }
  },
  compoundVariants: [
    {
      variant: `h3`,
      margin: `none`,
      className: `pb-2`
    }
  ],
  defaultVariants: {
    variant: `span`
  }
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof typographyVariants> {
  as?: Components
}

const Typography = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as, variant, theme, size, margin, className, ...props }, ref) => {
    type variantType = Exclude<typeof variant, undefined | null>
    const variantMap: {
      [key in variantType]: Components
    } = {
      h1: `h1`,
      h2: `h2`,
      h3: `h3`,
      h4: `h4`,
      subtitle: `p`,
      body: `p`,
      p: `p`,
      span: `span`
    }
    const Component = as || (variant && variantMap[variant]) || `p`
    return (
      <Component
        ref={ref}
        className={cn(
          typographyVariants({ variant, theme, size, margin, className })
        )}
        {...props}
      />
    )
  }
)

Typography.displayName = `Typography`

export default Typography
