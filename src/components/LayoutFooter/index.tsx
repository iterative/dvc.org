import React from 'react'
import cn from 'classnames'

import { LayoutModifiers, ILayoutModifiable } from '../MainLayout'
import Link from '../Link'
import IconSet from '../IconSet'

import { getFirstPage } from '../../utils/sidebar'

import { ReactComponent as LogoSVG } from './logo.svg'
import styles from './styles.module.css'

const docsPage = getFirstPage()

const LayoutFooter: React.SFC<Required<ILayoutModifiable>> = ({
  modifiers
}) => (
  <footer className={styles.wrapper}>
    <div
      className={cn(
        styles.container,
        modifiers.includes(LayoutModifiers.Wide) && styles.wide
      )}
    >
      <div className={styles.top}>
        <a className={styles.logo} href="/" title="dvc.org">
          <LogoSVG />
        </a>
      </div>
      <div className={styles.columns}>
        <div className={styles.column}>
          <h2 className={styles.heading}>Product</h2>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link href="/" className={styles.link}>
                Overview
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/features" className={styles.link}>
                Features
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h2 className={styles.heading}>Help</h2>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link href="/support" className={styles.link}>
                Support
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/doc/tutorials/get-started" className={styles.link}>
                Get started
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/community" className={styles.link}>
                Community
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href={docsPage} className={styles.link}>
                Documentation
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h2 className={styles.heading}>Company</h2>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link href="/blog" className={styles.link}>
                Blog
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link
                href="https://iterative.ai/"
                className={styles.link}
                target="_blank"
              >
                <IconSet className={styles.icon} name="iterative" />
                Iterative.ai
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/doc/user-guide/privacy" className={styles.link}>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h2 className={styles.heading}>Social</h2>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link
                href="https://twitter.com/DVCorg"
                className={styles.link}
                target="_blank"
              >
                <IconSet className={styles.icon} name="twitter" />
                Twitter
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link
                href="https://github.com/iterative/dvc"
                className={styles.link}
                target="_blank"
              >
                <IconSet className={styles.icon} name="github" />
                GitHub
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/chat" className={styles.link} target="_blank">
                <IconSet className={styles.icon} name="discord" />
                Discord
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
)

export default LayoutFooter
