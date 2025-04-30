import cn from 'classnames'
import { Link } from 'gatsby'
import {
  connectStateResults,
  Highlight,
  Hits,
  Index,
  Snippet,
  PoweredBy
} from 'react-instantsearch-dom'

import * as styles from './styles.module.css'

const HitCount = connectStateResults(({ searchState, searchResults }) => {
  const hitCount = searchResults && searchResults.nbHits

  return hitCount > 0 ? (
    <div className={styles.result}>
      <h3>Blog Posts</h3>
      <div className={styles.hitCount}>
        {hitCount} result{hitCount !== 1 ? `s` : ``}
      </div>
    </div>
  ) : (
    <div className={styles.noResult}>
      No results found for query &quot;{searchState.query}&quot;
    </div>
  )
})

const PageHit = ({ hit }: { hit: { slug: string } }) => (
  <Link to={hit.slug}>
    <h4>
      <Highlight attribute="title" hit={hit} tagName="mark" />
    </h4>
    <p className="mt-1 text-xs text-gray-200">
      <Highlight attribute="description" hit={hit} tagName="mark" />
    </p>
    <p className="mt-1 text-sm text-gray-400">
      <Snippet attribute="body" hit={hit} tagName="mark" />
    </p>
  </Link>
)

const HitsInIndex = ({ index }: { index: { name: string } }) => (
  <Index indexName={index.name}>
    <div className={styles.searchResultHeader}>
      <HitCount />
    </div>
    <div className={styles.hits}>
      <Hits hitComponent={PageHit} />
    </div>
  </Index>
)

const SearchResult = ({
  indices,
  show
}: {
  indices: Array<{ name: string }>
  show: boolean
}) => (
  <div className={cn(styles.searchResult, show && styles.searchResultShow)}>
    <div className={styles.searchResultContent}>
      {indices.map(index => (
        <HitsInIndex index={index} key={index.name} />
      ))}
    </div>
    <PoweredBy className={styles.aisPoweredBy} />
  </div>
)

export default SearchResult
