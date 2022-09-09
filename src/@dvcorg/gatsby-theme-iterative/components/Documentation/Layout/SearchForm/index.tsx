import React, { useEffect, useState } from 'react'
import { loadResource } from '@dvcorg/gatsby-theme-iterative/src/utils/front/resources'

import * as styles from '@dvcorg/gatsby-theme-iterative/src/components/Documentation/Layout/SearchForm/styles.module.css'
import { Script } from 'gatsby'

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    docsearch?: (opts: Record<string, unknown>) => void
  }
}

const SearchForm: React.FC = props => {
  const [searchAvailable, setSearchAvailable] = useState<boolean>(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  useEffect(() => {
    async function loadDocsearch() {
      if (scriptLoaded && window && window.docsearch) {
        await loadResource(
          'https://cdn.jsdelivr.net/npm/docsearch.js@2.6.3/dist/cdn/docsearch.min.css'
        )
        window.docsearch({
          appId: '98DVTFT919',
          apiKey: '38e749a9a63356b1485bff02afe466af',
          indexName: 'dvc',
          inputSelector: '#doc-search',
          debug: false // Set to `true` if you want to inspect the dropdown
        })
        setSearchAvailable(true)
      }
    }

    loadDocsearch()
  }, [scriptLoaded])

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/docsearch.js@2.6.3/dist/cdn/docsearch.min.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className={styles.searchArea}>
        <div className={styles.container}>
          <input
            className={styles.input}
            type="text"
            id="doc-search"
            placeholder="Search docs"
            disabled={!searchAvailable}
            {...props}
          />
        </div>
      </div>
    </>
  )
}

export default SearchForm
