import cn from 'classnames'

import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import * as styles from './styles.module.css'

type ITwoRowsButtonLinkProps = {
  mode: 'azure' | 'purple' | 'outline' | 'vscode'
  className?: string
  title: string
  description: string
  icon?: React.ReactNode
  children?: React.ReactNode
  active?: boolean
  href: string
} & React.ButtonHTMLAttributes<HTMLAnchorElement>

const TwoRowsButtonLink: React.FC<ITwoRowsButtonLinkProps> = ({
  className,
  icon,
  title,
  description,
  children,
  mode,
  active,
  href,
  ...props
}) => (
  <Link
    href={href}
    className={cn(
      styles.button,
      styles[mode],
      active && styles.active,
      icon && styles.withIcon,
      className
    )}
    {...props}
  >
    {icon && <span className={styles.icon}>{icon}</span>}
    <span className={styles.text}>
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>
    </span>
    {children}
  </Link>
)

export default TwoRowsButtonLink
