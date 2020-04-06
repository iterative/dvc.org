import React, { useState, useEffect } from 'react'
import includes from 'lodash.includes'

import ShowOnly from '../../../ShowOnly'
import DesktopView from './DesktopView'
import MobileView from './MobileView'

import glossary from '../../../../../content/docs/glossary'
import styles from './styles.module.css'

const Tooltip: React.SFC<{ text: string }> = ({ text }) => {
  const [state, setState] = useState({
    description: '',
    header: '',
    match: false
  })

  useEffect(() => {
    glossary.contents.forEach(glossaryItem => {
      if (
        includes(
          glossaryItem.match.map(word => word.toLowerCase()),
          text.replace(/\n/g, ' ').toLowerCase()
        )
      ) {
        setState({
          description: glossaryItem.desc,
          header: glossaryItem.name,
          match: true
        })
      }
    })
  }, [text])

  if (!state.match) {
    return <span>{text}</span>
  }

  return (
    <>
      <ShowOnly on="desktop" className={styles.inline}>
        <DesktopView
          description={state.description}
          header={state.header}
          text={text}
        />
      </ShowOnly>
      <ShowOnly on="mobile">
        <MobileView
          description={state.description}
          header={state.header}
          text={text}
        />
      </ShowOnly>
    </>
  )
}

export default Tooltip
