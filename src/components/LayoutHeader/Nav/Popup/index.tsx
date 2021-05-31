import React from 'react'
import cn from 'classnames'

import Link from '../../../Link'
import { logEvent } from '../../../../utils/front/ga'

import { ReactComponent as CmlSVG } from '../../../../../static/img/cml-icon.svg'
import { ReactComponent as StudioSVG } from '../../../../../static/img/studio-icon.svg'
import { ReactComponent as LogoSVG } from '../../../../../static/img/logo.svg'
import { ReactComponent as ExternalLinkIcon } from '../../../../../static/img/external-link-icon.svg'

import styles from './styles.module.css'

interface IOtherToolsLinkData {
  href: string
  title: string
  description: string
  icon: JSX.Element
  target?: '_blank'
}

interface ICommunityLinkData {
  href: string
  text: string
}

const communityPopupData: Array<ICommunityLinkData> = [
  { text: 'Community', href: '/community' },
  { text: 'Meet the Community', href: '/community#meet' },
  { text: 'Contribute', href: '/community#contribute' },
  { text: 'Learn', href: '/community#learn' },
  { text: 'Events', href: '/community#events' }
]

const otherToolsPopupData: Array<IOtherToolsLinkData> = [
  {
    title: 'Studio',
    icon: <StudioSVG className={styles.linkIcon} />,
    description: 'Track experiments and share insights from ML projects',
    href: 'https://studio.iterative.ai/'
  },
  {
    title: 'DVC',
    icon: <LogoSVG className={styles.linkIcon} />,
    description: 'Open-source version control system for ML projects',
    href: '/'
  },
  {
    title: 'CML',
    icon: <CmlSVG className={styles.linkIcon} />,
    description: 'Open-source CI/CD for ML projects',
    href: 'https://cml.dev/'
  }
]

const Popup: React.FC<{
  className?: string
  isVisible?: boolean
}> = ({ children, isVisible, className }) => (
  <div className={cn(styles.popup, isVisible && styles.visible, className)}>
    {children}
  </div>
)

export const CommunityPopup: React.FC<{ isVisible: boolean }> = ({
  isVisible
}) => (
  <Popup className={styles.communityPopup} isVisible={isVisible}>
    {communityPopupData.map(({ text, href }, i) => (
      <Link
        className={styles.link}
        href={href}
        key={i}
        onClick={(): void => logEvent('menu', 'community')}
      >
        {text}
      </Link>
    ))}
  </Popup>
)

export const OtherToolsPopup: React.FC<{ isVisible: boolean }> = ({
  isVisible
}) => (
  <Popup className={styles.otherToolsPopup} isVisible={isVisible}>
    {otherToolsPopupData.map(
      ({ title, icon, description, href, target }, i) => (
        <Link className={styles.link} href={href} key={i} target={target}>
          {icon}
          <p className={styles.title}>
            {title}
            <ExternalLinkIcon className={styles.titleIcon} />
          </p>
          <p className={styles.description}>{description}</p>
        </Link>
      )
    )}
  </Popup>
)
