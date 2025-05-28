import React, { useRef, useState } from 'react'
import cn from 'classnames'

import Link from '../../../Link'
import { OtherToolsPopup, CommunityPopup } from '../Popup'

import { ReactComponent as ArrowUpSVG } from '../../../../images/arrow-up-icon.svg'
import { ReactComponent as ArrowDownSVG } from '../../../../images/arrow-down-icon.svg'

import { logEvent } from '../../../../utils/front/plausible'

import * as styles from './styles.module.css'
import { INavLinkData, INavLinkPopupData } from './types'

import navLinkItemsData from '../../../../data/headerNav'
import { getShowOnClass } from './getShowOnClass'

const LinkItems: React.FC = () => {
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

  const LinkItem = ({ showOn, eventType, href, text }: INavLinkData) => (
    <li className={cn('relative', getShowOnClass(showOn))}>
      <Link
        onClick={(): void => logEvent('Nav', { Item: eventType })}
        href={href}
        className={styles.link}
      >
        {text}
      </Link>
    </li>
  )
  const PopupItem = ({ popup, showOn, text }: INavLinkPopupData) => (
    <li
      className={cn('relative', getShowOnClass(showOn))}
      ref={
        popup === 'OtherToolsPopup'
          ? otherToolsPopupContainerEl
          : communityPopupContainerEl
      }
    >
      <>
        <button
          onClick={
            popup === 'OtherToolsPopup'
              ? toggleOtherToolsPopup
              : toggleCommunityPopup
          }
          className={cn(
            styles.link,
            (popup === 'OtherToolsPopup'
              ? isOtherToolsPopupOpen
              : isCommunityPopupOpen) && styles.open
          )}
        >
          {text}
          <ArrowDownSVG className={cn(styles.linkIcon, styles.arrowDownIcon)} />
          <ArrowUpSVG className={cn(styles.linkIcon, styles.arrowUpIcon)} />
        </button>
        {popup === 'OtherToolsPopup' ? (
          <OtherToolsPopup
            closePopup={closeAllPopups}
            isVisible={isOtherToolsPopupOpen}
          />
        ) : (
          <CommunityPopup
            closePopup={closeAllPopups}
            isVisible={isCommunityPopupOpen}
          />
        )}
      </>
    </li>
  )

  return (
    <ul className={styles.linksList}>
      {navLinkItemsData.map((item, i) =>
        (item as INavLinkPopupData).popup === undefined ? (
          <LinkItem {...(item as INavLinkData)} key={i} />
        ) : (
          <PopupItem {...(item as INavLinkPopupData)} key={i} />
        )
      )}
    </ul>
  )
}

export default LinkItems
