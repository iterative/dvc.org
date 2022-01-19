import cn from 'classnames'
import { Link } from 'gatsby'
import { default as React } from 'react'
import {
  connectStateResults,
  Highlight,
  Hits,
  Index,
  Snippet,
  PoweredBy
} from 'react-instantsearch-dom'

import * as styles from './styles.module.css'

const HitCount = connectStateResults(({ searchResults }) => {
  const hitCount = searchResults && searchResults.nbHits

  return hitCount > 0 ? (
    <div className={styles.hitCount}>
      {hitCount} result{hitCount !== 1 ? `s` : ``}
    </div>
  ) : null
})

const PageHit = ({ hit }: { hit: { slug: string } }) => (
  <div>
    <Link to={hit.slug}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h4>
    </Link>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </div>
)

const HitsInIndex = ({ index }: { index: { name: string } }) => (
  <Index indexName={index.name}>
    <HitCount />
    <Hits className={styles.hits} hitComponent={PageHit} />
  </Index>
)

const SearchResult = ({
  indices,
  show
}: {
  indices: Array<any>
  show: boolean
}) => (
  <div className={cn(styles.searchResult, show && styles.searchResultShow)}>
    {indices.map(index => (
      <HitsInIndex index={index} key={index.name} />
    ))}
    <PoweredBy className={styles.aisPoweredBy} />
  </div>
)

export default SearchResult
