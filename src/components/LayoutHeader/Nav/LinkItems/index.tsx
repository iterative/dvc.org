import React, { useRef } from 'react'
import cn from 'classnames'

import Link from '../../../Link'
import { OtherToolsPopup, CommunityPopup, useNavPopups } from '../Popup'

import { ReactComponent as ArrowUpSVG } from '../../../../../static/img/arrow-up-icon.svg'
import { ReactComponent as ArrowDownSVG } from '../../../../../static/img/arrow-down-icon.svg'

import { logEvent } from '../../../../utils/front/ga'
import { getFirstPage } from '../../../../utils/shared/sidebar'

const docsPage = getFirstPage()

import styles from './styles.module.css'

interface INavLinkData {
  href: string
  eventType: string
  text: string
}

interface INavLinkPopupData {
  onClickName: 'onCommunityButtonClick' | 'onOtherToolsButtonClick'
  isOpenName: 'isCommunityPopupOpen' | 'isOtherToolsPopupOpen'
  text: string
  type: 'community' | 'otherTools'
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
    onClickName: 'onCommunityButtonClick',
    isOpenName: 'isCommunityPopupOpen',
    text: 'Community',
    type: 'community'
  },
  {
    href: '/support',
    eventType: 'support',
    text: 'Support'
  },
  {
    onClickName: 'onOtherToolsButtonClick',
    isOpenName: 'isOtherToolsPopupOpen',
    text: 'Other Tools',
    type: 'otherTools'
  }
]

const isPopup = (
  item: INavLinkData | INavLinkPopupData
): item is INavLinkPopupData => (item as INavLinkPopupData).type !== undefined

const LinkItems: React.FC = ({}) => {
  const communityPopupContainerEl = useRef<HTMLLIElement>(null)
  const otherToolsPopupContainerEl = useRef<HTMLLIElement>(null)
  const navPopupsHelpers = useNavPopups(
    communityPopupContainerEl,
    otherToolsPopupContainerEl
  )
  return (
    <ul className={styles.linksList}>
      {navLinkItemsData.map((item, i) => (
        <li
          key={i}
          className={styles.linkItem}
          ref={
            isPopup(item)
              ? item.type === 'otherTools'
                ? otherToolsPopupContainerEl
                : communityPopupContainerEl
              : undefined
          }
        >
          {isPopup(item) ? (
            <>
              <button
                onClick={navPopupsHelpers[item.onClickName]}
                className={cn(
                  styles.link,
                  navPopupsHelpers[item.isOpenName] && styles.open
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
              {item.type === 'community' ? (
                <CommunityPopup isVisible={navPopupsHelpers[item.isOpenName]} />
              ) : (
                <OtherToolsPopup
                  isVisible={navPopupsHelpers[item.isOpenName]}
                />
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
