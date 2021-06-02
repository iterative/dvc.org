import React, { useRef, useState } from 'react'
import cn from 'classnames'

import Link from '../../../Link'
import { OtherToolsPopup, CommunityPopup } from '../Popup'

import { ReactComponent as ArrowUpSVG } from '../../../../../static/img/arrow-up-icon.svg'
import { ReactComponent as ArrowDownSVG } from '../../../../../static/img/arrow-down-icon.svg'

import { logEvent } from '../../../../utils/front/ga'
import { getFirstPage } from '../../../../utils/shared/sidebar'

const docsPage = getFirstPage()

import styles from './styles.module.css'

type PopupName = 'CommunityPopup' | 'OtherToolsPopup'

interface INavLinkData {
  href: string
  eventType: string
  text: string
}

interface INavLinkPopupData {
  text: string
  popup: PopupName
}

const navLinkItemsData: Array<INavLinkData | INavLinkPopupData> = [
  {
    href: '/features',
    eventType: 'features',
    text: 'Features'
  },
  {
    href: docsPage,
    eventType: 'doc',
    text: 'Doc'
  },
  {
    href: '/blog',
    eventType: 'blog',
    text: 'Blog'
  },
  {
    text: 'Community',
    popup: 'CommunityPopup'
  },
  {
    href: '/support',
    eventType: 'support',
    text: 'Support'
  },
  {
    text: 'Other Tools',
    popup: 'OtherToolsPopup'
  }
]

const isPopup = (
  item: INavLinkData | INavLinkPopupData
): item is INavLinkPopupData => (item as INavLinkPopupData).popup !== undefined

const LinkItems: React.FC = ({}) => {
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
    <ul className={styles.linksList}>
      {navLinkItemsData.map((item, i) => (
        <li
          key={i}
          className={styles.linkItem}
          ref={
            isPopup(item)
              ? item.popup === 'OtherToolsPopup'
                ? otherToolsPopupContainerEl
                : communityPopupContainerEl
              : undefined
          }
        >
          {isPopup(item) ? (
            <>
              <button
                onClick={
                  item.popup === 'OtherToolsPopup'
                    ? toggleOtherToolsPopup
                    : toggleCommunityPopup
                }
                className={cn(
                  styles.link,
                  (item.popup === 'OtherToolsPopup'
                    ? isOtherToolsPopupOpen
                    : isCommunityPopupOpen) && styles.open
                )}
              >
                {item.text}
                <ArrowDownSVG
                  className={cn(styles.linkIcon, styles.arrowDownIcon)}
                />
                <ArrowUpSVG
                  className={cn(styles.linkIcon, styles.arrowUpIcon)}
                />
              </button>
              {item.popup === 'OtherToolsPopup' ? (
                <OtherToolsPopup isVisible={isOtherToolsPopupOpen} />
              ) : (
                <CommunityPopup isVisible={isCommunityPopupOpen} />
              )}
            </>
          ) : (
            <Link
              onClick={(): void => logEvent('menu', item.eventType)}
              href={item.href}
              className={styles.link}
            >
              {item.text}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

export default LinkItems
