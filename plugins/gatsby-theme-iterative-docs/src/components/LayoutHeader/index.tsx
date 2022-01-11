import React from 'react'

import LayoutWidthContainer from '../LayoutWidthContainer'
import Link from '../Link'
import Nav from './Nav'

import { ReactComponent as LogoSVG } from '../../../static/img/dvc_icon-color--square_vector.svg'
import * as styles from './styles.module.css'

const LayoutHeader: React.FC = () => {
  return (
    <header id="header">
      <div className={styles.header}>
        <LayoutWidthContainer className={styles.container} wide>
          <Link
            href="/"
            className={styles.logoLink}
            title="DVC"
            aria-label="DVC"
          >
            <LogoSVG className={styles.logo} />
          </Link>
          <Link
            className={styles.company}
            href="https://iterative.ai/"
            target="_blank"
          >
            by <span className={styles.companyName}>iterative.ai</span>
          </Link>
          <Nav />
        </LayoutWidthContainer>
      </div>
    </header>
  )
}

export default LayoutHeader
