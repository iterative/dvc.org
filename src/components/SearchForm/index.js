import React from 'react'

import { Input, Wrapper } from './styles'

export default function SearchForm(props) {
  return (
    <Wrapper novalidate>
      <Input
        type="text"
        id="doc-search"
        placeholder={`Search docs`}
        {...props}
      />
    </Wrapper>
  )
}
