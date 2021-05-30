import React, { useState, useRef } from 'react'
import cn from 'classnames'

import Link from '../../Link'
import SocialIcon from '../../SocialIcon'
import PseudoButton from '../../PseudoButton'
import { OtherToolsPopup, CommunityPopup } from './Popup'

import { logEvent } from '../../../utils/front/ga'
import { getFirstPage } from '../../../utils/shared/sidebar'

import { ReactComponent as ArrowUpSVG } from '../../../../static/img/arrow-up-icon.svg'
import { ReactComponent as ArrowDownSVG } from '../../../../static/img/arrow-down-icon.svg'

const docsPage = getFirstPage()

import styles from './styles.module.css'

const Nav: React.FC = () => {
  const [isCommunityPopupOpen, setIsCommunityPopupOpen] = useState(false)
  const [isOtherToolsPopupOpen, setIsOtherToolsPopupOpen] = useState(false)
  const communityPopupContainerEl = useRef<HTMLLIElement>(null)
  const otherToolsPopupContainerEl = useRef<HTMLLIElement>(null)
  let pageCloseEventListener: () => void = () => null
  let keyupCloseEventListener: () => void = () => null

  const closeAllPopups = (): void => {
    setIsCommunityPopupOpen(false)
    setIsOtherToolsPopupOpen(false)

    pageCloseEventListener()
    keyupCloseEventListener()
  }

  const handlePageClick = (event: MouseEvent): void => {
    if (
      !communityPopupContainerEl.current ||
      !otherToolsPopupContainerEl.current
    ) {
      return
    }
    if (
      !communityPopupContainerEl.current.contains(event.target as Node) &&
      !otherToolsPopupContainerEl.current.contains(event.target as Node)
    ) {
      closeAllPopups()
    }
  }

  const handlePageKeyup = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      closeAllPopups()
    }
  }

  const setupPopupEventListeners = (): void => {
    document.addEventListener('click', handlePageClick)
    document.addEventListener('keyup', handlePageKeyup)

    pageCloseEventListener = (): void =>
      document.removeEventListener('click', handlePageClick)
    keyupCloseEventListener = (): void =>
      document.removeEventListener('keyup', handlePageKeyup)
  }

  const openCommunityPopup = (): void => {
    setupPopupEventListeners()
    setIsCommunityPopupOpen(true)
  }

  const openOtherToolsPopup = (): void => {
    setupPopupEventListeners()
    setIsOtherToolsPopupOpen(true)
  }

  const toggleCommunityPopup = (): void => {
    setIsOtherToolsPopupOpen(false)
    if (isCommunityPopupOpen) {
      closeAllPopups()
    } else {
      openCommunityPopup()
    }
  }

  const toggleOtherToolsPopup = (): void => {
    setIsCommunityPopupOpen(false)
    if (isOtherToolsPopupOpen) {
      closeAllPopups()
    } else {
      openOtherToolsPopup()
    }
  }

  return (
    <div className={styles.wrapper}>
      <ul className={styles.linksList}>
        <li className={styles.linkItem}>
          <Link
            href="/features"
            className={styles.link}
            onClick={(): void => logEvent('menu', 'features')}
          >
            Features
          </Link>
        </li>
        <li className={styles.linkItem}>
          <Link
            href={docsPage}
            className={styles.link}
            onClick={(): void => logEvent('menu', 'doc')}
          >
            Doc
          </Link>
        </li>
        <li className={styles.linkItem}>
          <Link
            href="/blog"
            className={styles.link}
            onClick={(): void => logEvent('menu', 'blog')}
          >
            Blog
          </Link>
        </li>
        <li className={styles.linkItem} ref={communityPopupContainerEl}>
          <button
            className={cn(styles.link, isCommunityPopupOpen && styles.open)}
            onClick={toggleCommunityPopup}
          >
            Community
            <ArrowDownSVG
              className={cn(styles.linkIcon, styles.arrowDownIcon)}
            />
            <ArrowUpSVG className={cn(styles.linkIcon, styles.arrowUpIcon)} />
          </button>
          <CommunityPopup isVisible={isCommunityPopupOpen} />
        </li>
        <li className={styles.linkItem}>
          <Link
            href="/support"
            className={styles.link}
            onClick={(): void => logEvent('menu', 'support')}
          >
            Support
          </Link>
        </li>
        <li className={styles.linkItem} ref={otherToolsPopupContainerEl}>
          <button
            className={cn(styles.link, isOtherToolsPopupOpen && styles.open)}
            onClick={toggleOtherToolsPopup}
          >
            Other Tools
            <ArrowDownSVG
              className={cn(styles.linkIcon, styles.arrowDownIcon)}
            />
            <ArrowUpSVG className={cn(styles.linkIcon, styles.arrowUpIcon)} />
          </button>
          <OtherToolsPopup isVisible={isOtherToolsPopupOpen} />
        </li>
        <li className={cn(styles.linkItem, styles.socialIconLinkItem)}>
          <SocialIcon
            site="github"
            label="Go to DVC Github page"
            url="https://github.com/iterative/dvc"
            className={cn(styles.link, styles.socialIcon)}
          />
        </li>
        <li className={cn(styles.linkItem, styles.socialIconLinkItem)}>
          <SocialIcon
            site="discord"
            label="Go to DVC Discord page"
            url="/chat"
            className={cn(styles.link, styles.socialIcon)}
          />
        </li>
      </ul>
      <PseudoButton
        className={`${styles.getStartedButton} btn-with-focus`}
        href="/doc/start"
        onClick={(): void => logEvent('menu', 'get-started')}
        size="none"
      >
        Get Started
      </PseudoButton>
    </div>
  )
}

export default Nav
