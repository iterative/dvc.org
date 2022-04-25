import React from 'react'
import cn from 'classnames'

import Link from 'gatsby-theme-iterative-docs/src/components/Link'
import { logEvent } from 'gatsby-theme-iterative-docs/src/utils/front/plausible'
import { navLinkItemsData } from '../LinkItems'

import { ReactComponent as ExternalLinkIcon } from '../../../../../static/img/external-link-icon.svg'

import * as styles from './styles.module.css'

interface IOtherToolsLinkData {
  href: string
  title: string
  description: string
  iconClass: string
  target?: '_blank'
}

interface ICommunityLinkData {
  href: string
  text: string
}

const communityPopupData: Array<ICommunityLinkData> = [
  { text: 'Meet the Community', href: '/community' },
  { text: 'Testimonials', href: '/community#testimonial' },
  { text: 'Contribute', href: '/community#contribute' },
  { text: 'Learn', href: '/community#learn' },
  { text: 'Events', href: '/community#events' }
]

const otherToolsPopupData: Array<IOtherToolsLinkData> = [
  {
    title: 'Studio',
    iconClass: styles.studioIcon,
    description: 'Track experiments and share insights from ML projects',
    href: 'https://studio.iterative.ai/'
  },
  {
    title: 'DVC',
    iconClass: styles.dvcIcon,
    description: 'Open-source version control system for ML projects',
    href: '/'
  },
  {
    title: 'CML',
    iconClass: styles.cmlIcon,
    description: 'Open-source CI/CD for ML projects',
    href: 'https://cml.dev/'
  },
  {
    title: 'MLEM',
    iconClass: styles.mlemIcon,
    description:
      'Open-source model registry and deployment tool for ML projects',
    href: 'https://mlem.ai/'
  }
]

export interface IPopupProps {
  isVisible: boolean
  closePopup: () => void
}

export const BasePopup: React.FC<{
  className?: string
  isVisible: boolean
}> = ({ children, isVisible, className }) => (
  <div className={cn(styles.popup, isVisible && styles.visible, className)}>
    {children}
  </div>
)

export const CommunityPopup: React.FC<IPopupProps> = ({
  isVisible,
  closePopup
}) => (
  <BasePopup className={styles.communityPopup} isVisible={isVisible}>
    {communityPopupData.map(({ text, href }, i) => (
      <Link
        className={styles.link}
        href={href}
        key={i}
        onClick={(): void => {
          logEvent('Nav', { Item: 'community' })
          closePopup()
        }}
      >
        {text}
      </Link>
    ))}
  </BasePopup>
)

export const OtherPopup: React.FC<IPopupProps> = ({
  isVisible,
  closePopup
}) => (
  <BasePopup className={styles.otherPopup} isVisible={isVisible}>
    {navLinkItemsData.map(
      ({ text, href }, i) =>
        href && (
          <Link
            className={styles.link}
            href={href}
            key={i}
            onClick={closePopup}
          >
            {text}
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
    {otherToolsPopupData.map(
      ({ title, iconClass, description, href, target }, i) => (
        <Link
          className={styles.link}
          href={href}
          key={i}
          target={target}
          onClick={closePopup}
        >
          <div className={cn(styles.linkIcon, iconClass)} />
          <p className={styles.title}>
            {title}
            {/^https?:\/\//.test(href) && (
              <ExternalLinkIcon className={styles.titleIcon} />
            )}
          </p>
          <p className={styles.description}>{description}</p>
        </Link>
      )
    )}
  </BasePopup>
)
