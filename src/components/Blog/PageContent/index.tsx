import { cn } from '@/utils'

import * as styles from './styles.module.css'

interface IPageContentProps {
  className?: string
  children: React.ReactNode
}

const PageContent: React.FC<IPageContentProps> = ({ className, children }) => (
  <div className={styles.wrapper}>
    <div className={cn(styles.pageContent, className)}>{children}</div>
  </div>
)

export default PageContent
