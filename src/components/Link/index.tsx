import { Link as GatsbyLink, GatsbyLinkProps } from 'gatsby'
import { ExternalLinkIcon } from 'lucide-react'
import { ReactNode } from 'react'

import { cn } from '@/utils'
import { isExternalLink } from '@/utils/urls'

interface LinkProps extends Omit<GatsbyLinkProps<unknown>, 'to' | 'ref'> {
  href: string
  disabled?: boolean
  isExternal?: boolean
  showExternalIcon?: boolean
  smallExternalIcon?: boolean
  rel?: string
  target?: string
  children: ReactNode
  className?: string
}

const defaultLinkClassNames = `transition-colors cursor-pointer`

function Link({
  href,
  disabled,
  isExternal = isExternalLink(href),
  rel = isExternal ? `noopener noreferrer` : undefined,
  target = isExternal ? `_blank` : undefined,
  children,
  className,
  showExternalIcon = true,
  smallExternalIcon = false,
  ...props
}: LinkProps) {
  if (disabled) {
    return (
      <span
        className={cn(
          `cursor-default text-zinc-400 hover:cursor-default hover:text-inherit focus:text-inherit`,
          className
        )}
      >
        {children}
      </span>
    )
  }
  if (isExternal) {
    return (
      <a
        className={cn(
          defaultLinkClassNames,
          `inline-flex items-center gap-1`,
          className
        )}
        rel={rel}
        target={target}
        href={href}
        {...props}
      >
        {children}
        {showExternalIcon && (
          <ExternalLinkIcon
            className={cn(
              `inline-block h-3 w-3 md:h-4 md:w-4`,
              smallExternalIcon && `h-2 w-2 md:h-3 md:w-3`
            )}
          />
        )}
      </a>
    )
  }
  return (
    <GatsbyLink
      className={cn(defaultLinkClassNames, className)}
      target={target}
      to={href}
      {...props}
    >
      {children}
    </GatsbyLink>
  )
}

export default Link

export const PageLink = ({ className, ...props }: LinkProps) => {
  return (
    <Link
      className={cn(
        `text-cyan-400 underline-offset-2 hover:underline`,
        className
      )}
      smallExternalIcon={true}
      {...props}
    />
  )
}
