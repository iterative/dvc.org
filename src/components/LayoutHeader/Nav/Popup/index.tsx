import React, { useState } from 'react'
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
  { text: 'Meet the Community', href: '/community' },
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

type useNavPopupsHelpers = {
  onCommunityButtonClick: () => void
  onOtherToolsButtonClick: () => void
  isOtherToolsPopupOpen: boolean
  isCommunityPopupOpen: boolean
}

export const useNavPopups: (
  communityPopupContainerEl: { current: HTMLLIElement | null },
  otherToolsPopupContainerEl: { current: HTMLLIElement | null }
) => useNavPopupsHelpers = (
  communityPopupContainerEl,
  otherToolsPopupContainerEl
) => {
  const [isCommunityPopupOpen, setIsCommunityPopupOpen] = useState(false)
  const [isOtherToolsPopupOpen, setIsOtherToolsPopupOpen] = useState(false)
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

  const togglePopup = (
    closeOtherPopups: () => void,
    isSelectedPopupOpen: boolean,
    openSelectedPopup: () => void
  ): void => {
    closeOtherPopups()
    if (isSelectedPopupOpen) {
      closeAllPopups()
    } else {
      openSelectedPopup()
    }
  }

  const onCommunityButtonClick = (): void =>
    togglePopup(
      (): void => setIsOtherToolsPopupOpen(false),
      isCommunityPopupOpen,
      openCommunityPopup
    )
  const onOtherToolsButtonClick = (): void =>
    togglePopup(
      (): void => setIsCommunityPopupOpen(false),
      isOtherToolsPopupOpen,
      openOtherToolsPopup
    )

  return {
    onCommunityButtonClick,
    onOtherToolsButtonClick,
    isOtherToolsPopupOpen,
    isCommunityPopupOpen
  }
}

export const Popup: React.FC<{
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
