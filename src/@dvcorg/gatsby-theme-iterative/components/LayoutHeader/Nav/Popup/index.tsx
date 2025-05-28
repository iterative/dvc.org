import cn from 'classnames'
import { PropsWithChildren } from 'react'

import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'

import menuData from '../../../../data/menu'

import * as styles from './styles.module.css'

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
