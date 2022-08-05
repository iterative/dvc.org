import React, { useRef, useEffect, useCallback, useState } from 'react'
import cn from 'classnames'

import TwoRowsButton from '../TwoRowsButton'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'

import * as styles from './styles.module.css'
import { OS, useUserOS } from '../../utils/front/useUserOS'

const VERSION = `2.15.0`

const dropdownItems = [
  OS.UNKNOWN,
  null,
  OS.OSX,
  OS.WINDOWS,
  OS.LINUX,
  OS.LINUX_RPM
]

interface IDownloadButtonDropdownItemsProps {
  userOS: OS
  onClick: (os: OS) => void
}

interface IDownloadButtonProps {
  openTop?: boolean
}

interface IOSDescription {
  title: string
  url: string
  download: boolean
}

const itemsByOs: Record<OS, IOSDescription> = {
  [OS.UNKNOWN]: {
    title: 'pip, conda, brew',
    url: `/doc/install`,
    download: false
  },
  [OS.OSX]: {
    title: 'macOS',
    url: `/download/osx/dvc-${VERSION}`,
    download: true
  },
  [OS.WINDOWS]: {
    title: 'Windows',
    url: `/download/win/dvc-${VERSION}`,
    download: true
  },
  [OS.LINUX]: {
    title: 'Linux Deb',
    url: `/download/linux-deb/dvc-${VERSION}`,
    download: true
  },
  [OS.LINUX_RPM]: {
    title: 'Linux RPM',
    url: `/download/linux-rpm/dvc-${VERSION}`,
    download: true
  }
}

const DownloadButtonDropdownItems: React.FC<
  IDownloadButtonDropdownItemsProps
> = ({ onClick, userOS }) => {
  return (
    <div
    // className={styles.links}
    >
      {dropdownItems.map((os, index) => {
        if (os === null) {
          return (
            <div
              className={styles.dropdownDelimiter}
              key={`delimiter-${index}`}
            />
          )
        }

        const item = itemsByOs[os]

        return (
          <Link
            download={item.download}
            key={os}
            className={cn(
              styles.dropdownItem,
              os === userOS && styles.active,
              'link-with-focus'
            )}
            href={item.url}
            optOutPreRedirect={true}
            onClick={(): void => onClick(os)}
          >
            {item.title}
          </Link>
        )
      })}
    </div>
  )
}

const DownloadButton: React.FC<IDownloadButtonProps> = ({ openTop }) => {
  const userOS = useUserOS()
  const currentOS = itemsByOs[userOS]
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpened, setOpened] = useState(false)
  const [isClicked, setClicked] = useState(false)
  const toggle = useCallback(
    () =>
      setOpened(prev => {
        if (!isClicked) {
          setClicked(true)
          logEvent('Download Button')
        }

        return !prev
      }),
    [isOpened, isClicked]
  )

  const download = (os: OS): void => {
    setOpened(false)
    logEvent('Download Button', { OS: os })
  }

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent): void => {
      if (isOpened && !containerRef.current?.contains(e.target as Node)) {
        setOpened(false)
      }
    }

    document.addEventListener('mousedown', onOutsideClick)

    return (): void => document.removeEventListener('mousedown', onOutsideClick)
  }, [isOpened, containerRef.current])

  return (
    <span className={styles.container} ref={containerRef}>
      <TwoRowsButton
        mode="purple"
        className={cn(
          'btn-with-focus',
          styles.button,
          isOpened && styles.opened
        )}
        title="Download"
        active={isOpened}
        description={`(${currentOS.title})`}
        icon={
          <img
            className={styles.buttonIcon}
            src="/img/download-arrow.svg"
            alt="Download"
          />
        }
        onClick={toggle}
      >
        <img className={styles.triangle} src="/img/triangle.svg" alt="" />
      </TwoRowsButton>
      <div
        className={cn(
          styles.dropdown,
          isOpened && styles.open,
          openTop && styles.openTop
        )}
      >
        <DownloadButtonDropdownItems onClick={download} userOS={userOS} />
      </div>
    </span>
  )
}

export default DownloadButton
