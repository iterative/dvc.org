import cn from 'classnames'
import React, { useEffect, useState, useCallback, MouseEvent } from 'react'

import HamburgerIcon from '../HamburgerIcon'
import Link from '../Link'
import { logEvent } from '../../utils/front/plausible'

import { getFirstPage } from '../../utils/shared/sidebar'
import { ReactComponent as LogoSVG } from '../../images/logo-white.svg'
import { ReactComponent as TwitterIcon } from '../SocialIcon/twitter.svg'
import { ReactComponent as GithubIcon } from '../SocialIcon/github.svg'
import mailIcon from '../../images/icon-mail.svg'
import discordLogo from '../../images/icon-discord.svg'
import dvcLogo from '../../images/dvc_icon-color--square_vector.svg'
import cmlLogo from '../../images/cml_icon-color--square_vector.svg'
import studioLogo from '../../images/studio_icon-color--square_vector.svg'
import mlemLogo from '../../images/mlem-icon.svg'

import * as styles from './styles.module.css'

const docsPage = getFirstPage()

export type HamburgerHelpers = {
  opened: boolean
  setOpened: (newState: boolean) => void
  handleToggle: () => void
  handleClose: () => void
  handleItemClick: (name?: string) => (e: MouseEvent) => void
}

export const useHamburgerMenu: () => HamburgerHelpers = () => {
  const [opened, setOpened] = useState(false)

  const handleToggle = useCallback(() => setOpened(!opened), [opened])

  const handleClose = useCallback(() => setOpened(false), [])

  const handleItemClick = useCallback<(item?: string) => void>(
    item => (): void => {
      handleClose()
      if (item) {
        logEvent('Hamburger Menu', { Item: item })
      }
    },
    [handleClose]
  )

  useEffect(() => {
    const method = opened ? 'add' : 'remove'
    document.body.classList[method](styles.hiddenScrollbar)
  }, [opened])

  return {
    opened,
    setOpened,
    handleToggle,
    handleClose,
    handleItemClick
  } as HamburgerHelpers
}

export const HamburgerMenu: React.FC<
  Pick<HamburgerHelpers, 'opened' | 'handleItemClick' | 'handleToggle'> & {
    collapsed: boolean
  }
> = ({ opened, handleItemClick }) => {
  return (
    <div className={cn(styles.wrapper, opened && styles.opened)}>
      <div className={styles.logoRow}>
        <Link
          onClick={() => handleItemClick()}
          href="/"
          className={styles.logo}
          aria-label="Home"
        >
          <LogoSVG />
        </Link>
      </div>
      <ul className={styles.sections}>
        <li className={styles.section}>
          <Link
            href={docsPage}
            className={styles.sectionHeading}
            onClick={() => handleItemClick('doc')}
          >
            Doc
          </Link>
        </li>
        <li className={styles.section}>
          <div className={styles.sectionHeading}>Support</div>
          <ul className={styles.subSections}>
            <li className={styles.subSection}>
              <Link
                className={styles.subSectionLink}
                href="mailto:support@dvc.org"
                target="_blank"
                onClick={() => handleItemClick('mail')}
              >
                <img
                  className={styles.subSectionLinkImage}
                  src={mailIcon}
                  alt=""
                />
                <span className={styles.subSectionLinkTitle}>E-Mail</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link
                className={styles.subSectionLink}
                href="https://github.com/iterative/dvc"
                onClick={() => handleItemClick('github')}
                target="_blank"
              >
                <GithubIcon className={styles.subSectionLinkImage} />
                <span className={styles.subSectionLinkTitle}>GitHub</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link
                className={styles.subSectionLink}
                href="/chat"
                onClick={() => handleItemClick('chat')}
                target="_blank"
              >
                <img
                  className={styles.subSectionLinkImage}
                  src={discordLogo}
                  alt=""
                />
                <span className={styles.subSectionLinkTitle}>Discord</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link
                className={styles.subSectionLink}
                href="https://twitter.com/DVCorg"
                onClick={() => handleItemClick('twitter')}
                target="_blank"
              >
                <TwitterIcon className={styles.subSectionLinkImage} />
                <span className={styles.subSectionLinkTitle}>Twitter</span>
              </Link>
            </li>
          </ul>
        </li>
        <li className={styles.section}>
          <p className={styles.sectionHeading}>All Tools</p>
          <ul className={styles.subSections}>
            <li className={styles.subSection}>
              <Link
                href="https://studio.iterative.ai/"
                className={styles.subSectionLink}
              >
                <img
                  className={styles.subSectionLinkImage}
                  src={studioLogo}
                  alt="Studio logo"
                />
                <span className={styles.subSectionLinkTitle}>Studio</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link href="/" className={styles.subSectionLink}>
                <img
                  className={styles.subSectionLinkImage}
                  src={dvcLogo}
                  alt="DVC logo"
                />
                <span className={styles.subSectionLinkTitle}>DVC</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link href="https://cml.dev/" className={styles.subSectionLink}>
                <img
                  className={styles.subSectionLinkImage}
                  src={cmlLogo}
                  alt="CML logo"
                />
                <span className={styles.subSectionLinkTitle}>CML</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link href="https://mlem.ai/" className={styles.subSectionLink}>
                <img
                  className={styles.subSectionLinkImage}
                  src={mlemLogo}
                  alt="MLEM logo"
                />
                <span className={styles.subSectionLinkTitle}>MLEM</span>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
      <Link
        href="/doc/start"
        className={styles.linkButton}
        onClick={() => handleItemClick('get-started')}
      >
        Get started
      </Link>
    </div>
  )
}

export const HamburgerButton: React.FC<{
  opened: boolean
  collapsed: boolean
  handleClick: (e: MouseEvent) => void
}> = ({ opened, collapsed, handleClick }) => (
  <button
    className={cn(
      styles.toggleButton,
      collapsed || styles.expanded,
      opened && styles.opened
    )}
    onClick={handleClick}
    aria-label="Toggle Mobile Menu"
  >
    <HamburgerIcon opened={opened} />
  </button>
)
