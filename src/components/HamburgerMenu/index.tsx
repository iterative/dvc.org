import cn from 'classnames'
import React, {
  useEffect,
  useState,
  useCallback,
  MouseEvent,
  KeyboardEvent
} from 'react'

import HamburgerIcon from '../HamburgerIcon'
import Link from '../Link'
import { logEvent } from '../../utils/front/ga'

import { getFirstPage } from '../../utils/shared/sidebar'
import { ReactComponent as LogoSVG } from '../../../static/img/logo-white.svg'
import { ReactComponent as TwitterIcon } from '../SocialIcon/twitter.svg'
import { ReactComponent as GithubIcon } from '../SocialIcon/github.svg'

import styles from './styles.module.css'

const docsPage = getFirstPage()

export type HamburgerHelpers = {
  opened: boolean
  setOpened: (newState: boolean) => void
  handleToggle: () => void
  handleKeyDown: (e: KeyboardEvent) => void
  handleClose: () => void
  handleItemClick: (name: string) => (e: MouseEvent) => void
}

export const useHamburgerMenu: () => HamburgerHelpers = () => {
  const [opened, setOpened] = useState(false)

  const handleToggle = useCallback(() => setOpened(!opened), [opened])
  const handleKeyDown = useCallback(e => {
    if (e.which === 13) {
      handleToggle()
    }
  }, [])

  const handleClose = useCallback(() => setOpened(false), [opened])
  const handleItemClick = useCallback(
    item => (): void => {
      close()
      logEvent('hamburger', item)
    },
    []
  )

  useEffect(() => {
    const method = opened ? 'add' : 'remove'
    document.body.classList[method](styles.hiddenScrollbar)
  }, [opened])

  return {
    opened,
    setOpened,
    handleToggle,
    handleKeyDown,
    handleClose,
    handleItemClick
  }
}

export const HamburgerMenu: React.FC<
  Pick<
    HamburgerHelpers,
    'opened' | 'handleItemClick' | 'handleKeyDown' | 'handleToggle'
  > & {
    collapsed: boolean
  }
> = ({ opened, handleItemClick }) => {
  return (
    <div className={cn(styles.wrapper, opened && styles.opened)}>
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
            onClick={handleItemClick('features')}
          >
            Features
          </Link>
        </li>
        <li className={styles.section}>
          <Link
            href={docsPage}
            className={styles.sectionLink}
            onClick={handleItemClick('doc')}
          >
            Doc
          </Link>
        </li>
        <li className={styles.section}>
          <Link
            href="/blog"
            className={styles.sectionLink}
            onClick={handleItemClick('blog')}
          >
            Blog
          </Link>
        </li>
        <li className={styles.section}>
          <Link
            href="/community"
            className={styles.sectionLink}
            onClick={handleItemClick('community')}
          >
            Community
          </Link>
          <ul className={styles.subSections}>
            <li className={styles.subSection}>
              <Link
                href="/community#meet"
                className={styles.subSectionLink}
                onClick={handleItemClick('community')}
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
                onClick={handleItemClick('community')}
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
                onClick={handleItemClick('community')}
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
                onClick={handleItemClick('community')}
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
            onClick={handleItemClick('support')}
          >
            Support
          </Link>
          <ul className={styles.subSections}>
            <li className={styles.subSection}>
              <Link
                className={styles.subSectionLink}
                href="mailto:support@dvc.org"
                target="_blank"
                onClick={handleItemClick('mail')}
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
                onClick={handleItemClick('github')}
                target="_blank"
              >
                <GithubIcon className={styles.subSectionLinkImage} />
                <span className={styles.subSectionLinkTitle}>GitHub</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link
                className={styles.subSectionLink}
                href="/chat"
                onClick={handleItemClick('chat')}
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
                onClick={handleItemClick('twitter')}
                target="_blank"
              >
                <TwitterIcon className={styles.subSectionLinkImage} />
                <span className={styles.subSectionLinkTitle}>Twitter</span>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
      <Link
        href="/doc/start"
        className={styles.linkButton}
        onClick={handleItemClick('get-started')}
      >
        Get started
      </Link>
    </div>
  )
}

export const HamburgerButton: React.FC<{
  opened: boolean
  collapsed: boolean
  handleClick: (e: MouseEvent) => void
  handleKeyDown: (e: KeyboardEvent) => void
}> = ({ opened, collapsed, handleClick, handleKeyDown }) => (
  <button
    className={cn(styles.toggleButton, collapsed || styles.expanded)}
    onClick={handleClick}
    onKeyDown={handleKeyDown}
    aria-label="Toggle Mobile Menu"
  >
    <HamburgerIcon opened={opened} />
  </button>
)
