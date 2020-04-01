import React, { useEffect, useState } from 'react'
import Promise from 'promise-polyfill'
import { loadResource } from '../../../../utils/resources'

import { SearchArea, Input, Wrapper } from './styles'

export default function SearchForm(props) {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    // When mailchimp loads it adds AMD support and docsearch define new AMD
    // unnamed(!) modules instead of global variable
    if (window.define) {
      window.define.amd = false
    }

    Promise.all([
      loadResource(
        'https://cdn.jsdelivr.net/npm/docsearch.js@2.6.2/dist/cdn/docsearch.min.css'
      ),
      loadResource(
        'https://cdn.jsdelivr.net/npm/docsearch.js@2.6.2/dist/cdn/docsearch.min.js'
      )
    ]).then(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) {
      window.docsearch &&
        window.docsearch({
          apiKey: '755929839e113a981f481601c4f52082',
          indexName: 'dvc',
          inputSelector: '#doc-search',
          debug: false // Set to `true` if you want to inspect the dropdown
        })
    }
  }, [isLoaded])

  if (!isLoaded) {
    return null
  }

  return (
    <SearchArea>
      <Wrapper novalidate>
        <Input
          type="text"
          id="doc-search"
          placeholder={`Search docs`}
          {...props}
        />
      </Wrapper>
    </SearchArea>
  )
}
