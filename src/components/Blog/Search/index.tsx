import algoliasearch from 'algoliasearch/lite'
import cn from 'classnames'
import { useState, useMemo, useRef } from 'react'
import { InstantSearch } from 'react-instantsearch-dom'
import useClickAway from 'react-use/lib/useClickAway'

import config from '@/config'

import SearchBox from './SearchBox'
import SearchResult from './SearchResult'
import * as styles from './styles.module.css'

export default function Search({
  indices
}: {
  indices: Array<{ name: string }>
}): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState(``)
  const [hasFocus, setFocus] = useState(false)
  const searchClient = useMemo(
    () => algoliasearch(config.algolia.appId, config.algolia.searchKey),
    []
  )

  useClickAway(rootRef, () => {
    setQuery(``)
    setFocus(false)
  })

  return (
    <div className={cn(styles.searchDiv, hasFocus && styles.flexGrow)}>
      <div className={styles.searchContainer} ref={rootRef}>
        <div className={styles.search}>
          <InstantSearch
            searchClient={searchClient}
            indexName={indices[0].name}
            onSearchStateChange={({ query }) => setQuery(query)}
          >
            <SearchBox setFocus={setFocus} />
            <SearchResult
              show={!!query && query.length > 0 && hasFocus}
              indices={indices}
            />
          </InstantSearch>
        </div>
      </div>
    </div>
  )
}
