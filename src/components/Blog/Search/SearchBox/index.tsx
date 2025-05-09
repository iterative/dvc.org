import { PropsWithChildren } from 'react'
import { SearchBoxProvided } from 'react-instantsearch-core'
import { connectSearchBox } from 'react-instantsearch-dom'

import * as styles from './styles.module.css'

interface ISearchBox extends SearchBoxProvided {
  setFocus: (arg0: boolean) => void
}

const SearchBox = connectSearchBox(
  ({ refine, currentRefinement, setFocus }: PropsWithChildren<ISearchBox>) => (
    <form onSubmit={e => e.preventDefault()} className={styles.form}>
      <input
        className={styles.searchInput}
        type="search"
        placeholder="Search Blog"
        aria-label="Search Blog"
        onChange={e => refine(e.target.value)}
        value={currentRefinement}
        onFocus={() => setFocus(true)}
      />
    </form>
  )
)

export default SearchBox
