import React, { useRef, useEffect, useCallback, useState } from 'react'
import cn from 'classnames'

import TwoRowsButton from '../TwoRowsButton'
import Link from '../Link'

import isClient from '../../utils/front/isClient'
import { logEvent } from '../../utils/front/ga'

import styles from './styles.module.css'

const VERSION = `1.10.2`

enum OS {
  UNKNOWN = '...',
  OSX = 'osx',
  WINDOWS = 'win',
  LINUX = 'linux',
  LINUX_RPM = 'linux_rpm'
}

const itemsByOs = {
  [OS.UNKNOWN]: {
    title: 'pip, conda, brew',
    url: `/doc/install`,
    download: false
  },
  [OS.OSX]: {
    title: 'Mac OS',
    url: `https://github.com/iterative/dvc/releases/download/${VERSION}/dvc-${VERSION}.pkg`,
    download: true
  },
  [OS.WINDOWS]: {
    title: 'Windows',
    url: `https://github.com/iterative/dvc/releases/download/${VERSION}/dvc-${VERSION}.exe`,
    download: true
  },
  [OS.LINUX]: {
    title: 'Linux Deb',
    url: `https://github.com/iterative/dvc/releases/download/${VERSION}/dvc_${VERSION}_amd64.deb`,
    download: true
  },
  [OS.LINUX_RPM]: {
    title: 'Linux RPM',
    url: `https://github.com/iterative/dvc/releases/download/${VERSION}/dvc-${VERSION}-1.x86_64.rpm`,
    download: true
  }
}
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

const userAgentIs = (value: string): boolean =>
  navigator.userAgent.indexOf(value) !== -1

const getUserOS = (): OS => {
  let OSName = OS.UNKNOWN

  if (!isClient) return OSName
  if (userAgentIs('Win')) OSName = OS.WINDOWS
  if (userAgentIs('Mac')) OSName = OS.OSX
  if (userAgentIs('Linux')) OSName = OS.LINUX

  return OSName
}

const DownloadButtonDropdownItems: React.FC<IDownloadButtonDropdownItemsProps> = ({
  onClick,
  userOS
}) => {
  return (
    <div className={styles.links}>
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
  const userOS = useRef(getUserOS())
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpened, setOpened] = useState(false)
  const [isClicked, setClicked] = useState(false)
  const currentOS = itemsByOs[userOS.current]
  const toggle = useCallback(
    () =>
      setOpened(prev => {
        if (!isClicked) {
          setClicked(true)
          logEvent('button', 'download')
        }

        return !prev
      }),
    [isOpened, isClicked]
  )
  const download = (os: OS): void => {
    setOpened(false)
    logEvent('download', os)
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
        className={`${cn(
          styles.button,
          isOpened && styles.opened
        )} btn-with-focus`}
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
      {isOpened && (
        <div className={cn(styles.dropdown, openTop && styles.openTop)}>
          <DownloadButtonDropdownItems
            onClick={download}
            userOS={userOS.current}
          />
        </div>
      )}
    </span>
  )
}

export default DownloadButton
