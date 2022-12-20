import React from 'react'
import cn from 'classnames'

import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { IPopupProps } from '../Popup'

import { ReactComponent as ArrowUpSVG } from '../../../../../../../static/img/arrow-up-icon.svg'
import { ReactComponent as ArrowDownSVG } from '../../../../../../../static/img/arrow-down-icon.svg'

import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'
import usePopup, {
  IUsePopupReturn
} from '../../../../../../gatsby/hooks/usePopup'

import * as styles from './styles.module.css'
import { ReactComponent as EllipsisIcon } from '../../../../../../../static/img/ellipsis.svg'
import menuData from '../../../../data/menu'

type PopupName = 'communityPopup' | 'otherToolsPopup' | 'otherPopup'

export interface INavLinkData {
  href: string
  eventType: string
  text: string
  className?: string
}

export interface INavLinkPopupData {
  text: string | typeof EllipsisIcon
  popupName: PopupName
  ariaLabel?: string
  Popup: React.FC<IPopupProps>
  className?: string
  href?: string
  hideDropdown?: boolean
}

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
      {menuData.nav.map((item, i) => {
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
                  className={cn(
                    styles.link,
                    popup?.isOpen && styles.open,
                    item.className
                  )}
                >
                  {typeof item.text === 'string' ? item.text : <item.text />}
                  {!item.hideDropdown && (
                    <>
                      <ArrowDownSVG
                        className={cn(styles.linkIcon, styles.arrowDownIcon)}
                      />
                      <ArrowUpSVG
                        className={cn(styles.linkIcon, styles.arrowUpIcon)}
                      />
                    </>
                  )}
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
