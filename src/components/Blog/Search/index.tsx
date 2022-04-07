import algoliasearch from 'algoliasearch/lite'
import React, { useState, useMemo, useRef } from 'react'
import { InstantSearch } from 'react-instantsearch-dom'

import * as styles from './styles.module.css'
import config from '../../../config'
import SearchBox from './SearchBox'
import SearchResult from './SearchResult'
import useOnClickOutside from '../../../gatsby/hooks/useOnClickOutside'

export default function Search({
  indices
}: {
  indices: Array<{ name: string }>
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [hasFocus, setFocus] = useState(false)
  const searchClient = useMemo(
    () => algoliasearch(config.algolia.appId, config.algolia.searchKey),
    []
  )

  useOnClickOutside(rootRef, () => setFocus(false))

  return (
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
  )
}
