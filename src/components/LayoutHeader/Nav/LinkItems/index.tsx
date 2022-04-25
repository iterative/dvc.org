import React from 'react'
import cn from 'classnames'

import Link from 'gatsby-theme-iterative-docs/src/components/Link'
import {
  OtherToolsPopup,
  CommunityPopup,
  OtherPopup,
  IPopupProps
} from '../Popup'

import { ReactComponent as ArrowUpSVG } from '../../../../../static/img/arrow-up-icon.svg'
import { ReactComponent as ArrowDownSVG } from '../../../../../static/img/arrow-down-icon.svg'

import { logEvent } from 'gatsby-theme-iterative-docs/src/utils/front/plausible'
import { getFirstPage } from 'gatsby-theme-iterative-docs/src/utils/shared/sidebar'
import usePopup, { IUsePopupReturn } from '../../../../gatsby/hooks/usePopup'

const docsPage = getFirstPage()

import * as styles from './styles.module.css'
import { ReactComponent as EllipsisIcon } from '../../../../../static/img/ellipsis.svg'
import onSelectKey from '../../../../utils/onSelectKey'

type PopupName = 'communityPopup' | 'otherToolsPopup' | 'otherPopup'

interface INavLinkData {
  href: string
  eventType: string
  text: string
  className?: string
}

interface INavLinkPopupData {
  text: string | typeof EllipsisIcon
  popupName: PopupName
  ariaLabel?: string
  Popup: React.FC<IPopupProps>
  className?: string
  href?: string
}

export const navLinkItemsData: Array<INavLinkData | INavLinkPopupData> = [
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
    href: 'https://learn.iterative.ai/',
    eventType: 'course',
    text: 'Course'
  },
  {
    text: 'Community',
    Popup: CommunityPopup,
    href: '/community',
    popupName: 'communityPopup'
  },
  {
    href: '/support',
    eventType: 'support',
    text: 'Support'
  },
  {
    text: 'Other Tools',
    popupName: 'otherToolsPopup',
    Popup: OtherToolsPopup
  },
  {
    text: EllipsisIcon,
    ariaLabel: 'Show options',
    popupName: 'otherPopup',
    Popup: OtherPopup,
    className: styles.other
  }
]

const isPopup = (
  item: INavLinkData | INavLinkPopupData
): item is INavLinkPopupData =>
  (item as INavLinkPopupData).popupName !== undefined

const LinkItems: React.FC = () => {
  const communityPopup = usePopup()
  const otherToolsPopup = usePopup()
  const otherPopup = usePopup()
  const popups: { [key: string]: IUsePopupReturn } = {
    otherToolsPopup,
    communityPopup,
    otherPopup
  }

  return (
    <ul className={styles.linksList}>
      {navLinkItemsData.map((item, i) => {
        const popup = isPopup(item) ? popups[item.popupName] : undefined
        return (
          <li
            key={i}
            className={styles.linkItem}
            ref={popup?.containerEl}
            onMouseEnter={popup?.open}
            onMouseLeave={popup?.close}
          >
            {isPopup(item) && popup ? (
              <>
                <button
                  aria-label={item.ariaLabel}
                  onPointerUp={popup?.toggle}
                  onKeyUp={onSelectKey(popup?.toggle)}
                  className={cn(
                    styles.link,
                    popup?.isOpen && styles.open,
                    item.className
                  )}
                >
                  {typeof item.text === 'string' ? item.text : <item.text />}
                  <ArrowDownSVG
                    className={cn(styles.linkIcon, styles.arrowDownIcon)}
                  />
                  <ArrowUpSVG
                    className={cn(styles.linkIcon, styles.arrowUpIcon)}
                  />
                </button>
                <item.Popup isVisible={popup.isOpen} closePopup={popup.close} />
              </>
            ) : (
              !isPopup(item) &&
              item.eventType && (
                <Link
                  onClick={(): void =>
                    logEvent('Nav', { Item: item.eventType })
                  }
                  href={item.href}
                  className={cn(styles.link, item.className)}
                >
                  {item.text}
                </Link>
              )
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default LinkItems
