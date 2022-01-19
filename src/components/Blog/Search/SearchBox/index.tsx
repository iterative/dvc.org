import React from 'react'
import { connectSearchBox } from 'react-instantsearch-dom'

import * as styles from './styles.module.css'

const SearchBox = connectSearchBox(
  ({ refine, currentRefinement, setFocus }) => (
    <form className={styles.form}>
      <input
        className={styles.searchInput}
        type="search"
        placeholder="Search Blogs"
        aria-label="Search Blogs"
        onChange={e => refine(e.target.value)}
        value={currentRefinement}
        onFocus={() => setFocus(true)}
      />
    </form>
  )
)

export default SearchBox
