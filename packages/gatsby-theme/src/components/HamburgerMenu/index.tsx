import cn from 'classnames'
import { useEffect, useState, useCallback, MouseEvent } from 'react'

import {
  BLOGS_URL,
  HOME_PAGE_LINK,
  MAIN_SITE_URL
} from '@dvcorg/gatsby-theme/consts'
import menuData from '@dvcorg/gatsby-theme/src/data/menu'
import { logEvent } from '@dvcorg/gatsby-theme/src/utils/front/plausible'

import { ReactComponent as MailIcon } from '../../../../../static/img/community/icon-mail.svg'
import HamburgerIcon from '../HamburgerIcon'
import Link from '../Link'
import { ReactComponent as DiscordSVG } from '../SocialIcon/discord.svg'
import { ReactComponent as GithubIcon } from '../SocialIcon/github.svg'
import { ReactComponent as TwitterIcon } from '../SocialIcon/twitter.svg'

import * as styles from './styles.module.css'

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

  const handleItemClick = useCallback(
    (item?: string) => (): void => {
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
  }
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
          href={MAIN_SITE_URL}
          className={styles.logo}
          aria-label="Home"
        >
          <img src="/img/dvc_by_lakefs_white.svg" alt="DVC Logo" />
        </Link>
      </div>
      <ul className={styles.sections}>
        <li className={styles.section}>
          <Link
            href="/use-cases"
            className={styles.sectionHeading}
            onClick={() => handleItemClick('use-cases')}
          >
            Use Cases
          </Link>
        </li>
        <li className={styles.section}>
          <Link
            href={HOME_PAGE_LINK}
            className={styles.sectionHeading}
            onClick={() => handleItemClick('doc')}
          >
            Doc
          </Link>
        </li>
        <li className={styles.section}>
          <Link
            href={BLOGS_URL}
            className={styles.sectionHeading}
            onClick={() => handleItemClick('blog')}
          >
            Blog
          </Link>
        </li>
        <li className={styles.section}>
          <Link
            href="https://learn.dvc.org/"
            className={styles.sectionHeading}
            onClick={() => handleItemClick('course')}
          >
            Course
          </Link>
        </li>
        <li className={styles.section}>
          <Link
            href={`${MAIN_SITE_URL}/community`}
            className={styles.sectionHeading}
            onClick={() => handleItemClick('community')}
          >
            Community
          </Link>
          <ul className={styles.subSections}>
            {menuData.community.map(item => (
              <li className={styles.subSection} key={item.href}>
                <Link
                  href={item.href}
                  className={styles.subSectionLink}
                  onClick={() => handleItemClick('community')}
                >
                  <img
                    className={styles.subSectionLinkImage}
                    src={item.img}
                    alt={item.imgAlt}
                  />
                  <span className={styles.subSectionLinkTitle}>
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li className={styles.section}>
          <Link
            href="/support"
            className={styles.sectionHeading}
            onClick={() => handleItemClick('support')}
          >
            Support
          </Link>
          <ul className={styles.subSections}>
            <li className={styles.subSection}>
              <Link
                className={styles.subSectionLink}
                href="mailto:support@dvc.org"
                target="_blank"
                onClick={() => handleItemClick('mail')}
              >
                <MailIcon className={styles.subSectionLinkImage} />
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
                <DiscordSVG className={styles.subSectionLinkImage} />
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
      </ul>
      <Link
        href="/start"
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
}> = ({ opened, handleClick }) => (
  <button
    className={cn(styles.toggleButton, opened && styles.opened)}
    onClick={handleClick}
    aria-label="Toggle Mobile Menu"
  >
    <HamburgerIcon opened={opened} />
  </button>
)
