import cn from 'classnames'
import React, { useCallback, useState, useEffect } from 'react'

import HamburgerIcon from '../HamburgerIcon'
import Link from '../Link'

import { logEvent } from '../../utils/front/ga'
import { getFirstPage } from '../../utils/shared/sidebar'
import { ReactComponent as LogoSVG } from '../../../static/img/logo-white.svg'

import styles from './styles.module.css'

const docsPage = getFirstPage()

const HamburgerMenu: React.FC = () => {
  const [isOpened, setOpened] = useState(false)

  const toggleMobileMenu = useCallback(() => setOpened(!isOpened), [isOpened])
  const openOnEnterKey = useCallback(e => {
    if (e.which === 13) {
      toggleMobileMenu()
    }
  }, [])

  const close = useCallback(() => setOpened(false), [isOpened])
  const itemClick = useCallback(
    item => (): void => {
      close()
      logEvent('hamburger', item)
    },
    []
  )

  useEffect(() => {
    const method = isOpened ? 'add' : 'remove'

    document.body.classList[method](styles.hiddenScrollbar)
  }, [isOpened])

  return (
    <div>
      <button
        className={styles.toggleButton}
        onClick={toggleMobileMenu}
        onKeyDown={openOnEnterKey}
        aria-label="Toggle Mobile Menu"
      >
        <HamburgerIcon opened={isOpened} />
      </button>

      <div className={cn(styles.wrapper, isOpened && styles.opened)}>
        <div className={styles.logoRow}>
          <Link href="/" className={styles.logo} aria-label="Home">
            <LogoSVG />
          </Link>
        </div>
        <ul className={styles.sections}>
          <li className={styles.section}>
            <Link
              href="/features"
              className={styles.sectionLink}
              onClick={itemClick('features')}
            >
              Features
            </Link>
          </li>
          <li className={styles.section}>
            <Link
              href={docsPage}
              className={styles.sectionLink}
              onClick={itemClick('doc')}
            >
              Doc
            </Link>
          </li>
          <li className={styles.section}>
            <Link
              href="/blog"
              className={styles.sectionLink}
              onClick={itemClick('blog')}
            >
              Blog
            </Link>
          </li>
          <li className={styles.section}>
            <Link
              href="/community"
              className={styles.sectionLink}
              onClick={itemClick('community')}
            >
              Community
            </Link>
            <ul className={styles.subSections}>
              <li className={styles.subSection}>
                <Link
                  href="/community#meet"
                  className={styles.subSectionLink}
                  onClick={itemClick('community')}
                >
                  <img
                    className={styles.subSectionLinkImage}
                    src="/img/community/icon-community.svg"
                    alt=""
                  />
                  <span className={styles.subSectionLinkTitle}>Meet Us</span>
                </Link>
              </li>
              <li className={styles.subSection}>
                <Link
                  href="/community#contribute"
                  className={styles.subSectionLink}
                  onClick={itemClick('community')}
                >
                  <img
                    className={styles.subSectionLinkImage}
                    src="/img/community/icon-contribute.svg"
                    alt=""
                  />
                  <span className={styles.subSectionLinkTitle}>Contribute</span>
                </Link>
              </li>
              <li className={styles.subSection}>
                <Link
                  href="/community#learn"
                  className={styles.subSectionLink}
                  onClick={itemClick('community')}
                >
                  <img
                    className={styles.subSectionLinkImage}
                    src="/img/community/icon-learn.svg"
                    alt=""
                  />
                  <span className={styles.subSectionLinkTitle}>Learn</span>
                </Link>
              </li>
              <li className={styles.subSection}>
                <Link
                  href="/community#events"
                  className={styles.subSectionLink}
                  onClick={itemClick('community')}
                >
                  <img
                    className={styles.subSectionLinkImage}
                    src="/img/community/icon-events.svg"
                    alt=""
                  />
                  <span className={styles.subSectionLinkTitle}>Events</span>
                </Link>
              </li>
            </ul>
          </li>
          <li className={styles.section}>
            <Link
              href="/support"
              className={styles.sectionLink}
              onClick={itemClick('support')}
            >
              Support
            </Link>
            <ul className={styles.subSections}>
              <li className={styles.subSection}>
                <Link
                  className={styles.subSectionLink}
                  href="mailto:support@dvc.org"
                  target="_blank"
                  onClick={itemClick('mail')}
                >
                  <img
                    className={styles.subSectionLinkImage}
                    src="/img/community/icon-mail.svg"
                    alt=""
                  />
                  <span className={styles.subSectionLinkTitle}>E-Mail</span>
                </Link>
              </li>
              <li className={styles.subSection}>
                <Link
                  className={styles.subSectionLink}
                  href="https://github.com/iterative/dvc"
                  onClick={itemClick('github')}
                  target="_blank"
                >
                  <img
                    className={styles.subSectionLinkImage}
                    src="/img/community/icon-github.svg"
                    alt=""
                  />
                  <span className={styles.subSectionLinkTitle}>GitHub</span>
                </Link>
              </li>
              <li className={styles.subSection}>
                <Link
                  className={styles.subSectionLink}
                  href="/chat"
                  onClick={itemClick('chat')}
                  target="_blank"
                >
                  <img
                    className={styles.subSectionLinkImage}
                    src="/img/community/icon-discord.svg"
                    alt=""
                  />
                  <span className={styles.subSectionLinkTitle}>Discord</span>
                </Link>
              </li>
              <li className={styles.subSection}>
                <Link
                  className={styles.subSectionLink}
                  href="https://twitter.com/DVCorg"
                  onClick={itemClick('twitter')}
                  target="_blank"
                >
                  <img
                    className={styles.subSectionLinkImage}
                    src="/img/community/icon-twitter.svg"
                    alt=""
                  />
                  <span className={styles.subSectionLinkTitle}>Twitter</span>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <Link
          href="/doc/tutorials/get-started"
          className={styles.linkButton}
          onClick={itemClick('get-started')}
        >
          Get started
        </Link>
      </div>
    </div>
  )
}

export default HamburgerMenu
