import cn from 'classnames'
import { useLayoutEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import Link from '@dvcorg/gatsby-theme/src/components/Link'

import { ReactComponent as ArrowSVG } from './arrow.svg'
import {
  IPaginatorLocationContextValue,
  usePaginatorContext
} from './LocationContext'
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
  const { state } = usePaginatorContext() as IPaginatorLocationContextValue

  const fromPaginator = Boolean(state?.fromPaginator)

  const [needsSmoothScroll, setNeedsSmoothScroll] = useState(fromPaginator)

  useLayoutEffect(() => {
    // If we aren't coming from a paginator, we add the style tag.
    // Next page change between components with the paginator,
    // will be smooth scrolled
    setNeedsSmoothScroll(true)
  }, [needsSmoothScroll])

  return (
    <div className={styles.paginator}>
      {needsSmoothScroll && smoothScrollTag}
      {previousPage && (
        <>
          <Link
            className={cn(styles.link, styles.linkPrevious, 'link-with-focus')}
            href={previousPage}
            state={{ fromPaginator: true }}
          >
            <ArrowSVG />
            <span>Newer posts</span>
          </Link>

          {/* @ts-expect-error react-helmet types incompatible with React types */}
          <Helmet>
            <link rel="prev" href={previousPage} />
          </Helmet>
        </>
      )}
      {nextPage && (
        <>
          <Link
            className={cn(styles.link, styles.linkNext, 'link-with-focus')}
            href={nextPage}
            state={{ fromPaginator: true }}
          >
            <span>Older posts</span>
            <ArrowSVG />
          </Link>
          {/* @ts-expect-error react-helmet types incompatible with React types */}
          <Helmet>
            <link rel="next" href={nextPage} />
          </Helmet>
        </>
      )}
    </div>
  )
}

export default Paginator
