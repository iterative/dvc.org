import React, { PropsWithChildren } from 'react'
import cn from 'classnames'

import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'

import { ReactComponent as ExternalLinkIcon } from '../../../../../../../static/img/external-link-icon.svg'

import * as styles from './styles.module.css'
import menuData from '../../../../data/menu'

export interface IPopupProps {
  isVisible: boolean
  closePopup: () => void
}

export const BasePopup: React.FC<
  PropsWithChildren<{
    className?: string
    isVisible: boolean
  }>
> = ({ children, isVisible, className }) => (
  <div className={cn(styles.popup, isVisible && styles.visible, className)}>
    {children}
  </div>
)

export const CommunityPopup: React.FC<IPopupProps> = ({
  isVisible,
  closePopup
}) => (
  <BasePopup className={styles.communityPopup} isVisible={isVisible}>
    {menuData.community.map(({ text, title, href }, i) => (
      <Link
        className={styles.link}
        href={href}
        key={i}
        onClick={(): void => {
          logEvent('Nav', { Item: 'community' })
          closePopup()
        }}
      >
        {text || title}
      </Link>
    ))}
  </BasePopup>
)

export const OtherPopup: React.FC<IPopupProps> = ({
  isVisible,
  closePopup
}) => (
  <BasePopup className={styles.otherPopup} isVisible={isVisible}>
    {menuData.nav.map(
      ({ text, href }, i) =>
        href && (
          <Link
            className={styles.link}
            href={href}
            key={i}
            onClick={closePopup}
          >
            {text as React.ReactNode}
          </Link>
        )
    )}
  </BasePopup>
)

export const OtherToolsPopup: React.FC<IPopupProps> = ({
  isVisible,
  closePopup
}) => (
  <BasePopup className={styles.otherToolsPopup} isVisible={isVisible}>
    {menuData.products.map(
      (
        { title, icon, iconClass, description, href, target, titleImgClass },
        i
      ) => (
        <Link
          className={styles.link}
          href={href}
          key={i}
          target={target}
          onClick={closePopup}
        >
          {icon ? (
            <div
              className="h-8 w-8 flex justify-end"
              style={{ gridArea: 'icon' }}
            >
              {icon}
            </div>
          ) : (
            <div className={cn(styles.linkIcon, iconClass)} />
          )}
          <p className={styles.title}>
            {title} {href === '/' ? ' 👈' : null}
            {titleImgClass && (
              <span className={cn(styles.titleIcon, titleImgClass)}></span>
            )}
            {/^https?:\/\//.test(href) && (
              <ExternalLinkIcon className={styles.titleExternalIcon} />
            )}
          </p>
          <p className={styles.description}>{description}</p>
        </Link>
      )
    )}
  </BasePopup>
)
