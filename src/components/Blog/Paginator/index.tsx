import { useLocation } from '@gatsbyjs/reach-router'
import { useLayoutEffect, useState } from 'react'
import ReactHelmet from 'react-helmet'

import { cn } from '@/utils'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import { ReactComponent as ArrowSVG } from './arrow.svg'
import { IPaginatorLocationContextValue } from './LocationContext'
import * as styles from './styles.module.css'

export interface IPaginatorPageInfo {
  currentPage: number
  nextPage?: string
  previousPage?: string
}

export interface IPaginatorProps {
  pageInfo: IPaginatorPageInfo
}

// Enables a smooth scroll behavior between pages.
// Doesn't smooth scroll into posts because the paginator isn't mounted in both :)
const smoothScrollTag = (
  <style
    dangerouslySetInnerHTML={{
      __html: `html { scroll-behavior: smooth; }`
    }}
  />
)

const Paginator: React.FC<IPaginatorProps> = ({
  pageInfo: { nextPage, previousPage }
}) => {
  const { state } = useLocation() as IPaginatorLocationContextValue

  const fromPaginator = Boolean(state?.fromPaginator)

  const [needsSmoothScroll, setNeedsSmoothScroll] = useState(fromPaginator)

  useLayoutEffect(() => {
    // If we aren't coming from a paginator, we add the style tag.
    // Next page change between components with the paginator,
    // will be smooth scrolled
    setNeedsSmoothScroll(true)
  }, [needsSmoothScroll])

  if (!previousPage && !nextPage) {
    return null
  }

  return (
    <div className={styles.paginator}>
      {needsSmoothScroll && smoothScrollTag}
      {previousPage && (
        <>
          <Link
            className={cn(styles.link, styles.linkPrevious, `link-with-focus`)}
            href={previousPage}
            state={{ fromPaginator: true }}
          >
            <ArrowSVG />
            <span>Newer posts</span>
          </Link>
          <ReactHelmet>
            <link rel="prev" href={previousPage} />
          </ReactHelmet>
        </>
      )}
      {nextPage && (
        <>
          <Link
            className={cn(styles.link, styles.linkNext, `link-with-focus`)}
            href={nextPage}
            state={{ fromPaginator: true }}
          >
            <span>Older posts</span>
            <ArrowSVG />
          </Link>
          <ReactHelmet>
            <link rel="next" href={nextPage} />
          </ReactHelmet>
        </>
      )}
    </div>
  )
}

export default Paginator
