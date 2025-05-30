import cn from 'classnames'
import { useEffect, useState, useCallback, MouseEvent } from 'react'

import { blogsPageLink } from '@/constants/internalLinks'
import HamburgerIcon from '@dvcorg/gatsby-theme/src/components/HamburgerIcon'
import * as styles from '@dvcorg/gatsby-theme/src/components/HamburgerMenu/styles.module.css'
import Link from '@dvcorg/gatsby-theme/src/components/Link'
import LogoGradient from '@dvcorg/gatsby-theme/src/components/LogoGradient'
import { ReactComponent as GithubIcon } from '@dvcorg/gatsby-theme/src/components/SocialIcon/github.svg'
import { ReactComponent as TwitterIcon } from '@dvcorg/gatsby-theme/src/components/SocialIcon/twitter.svg'
import { logEvent } from '@dvcorg/gatsby-theme/src/utils/front/plausible'
import { getFirstPage } from '@dvcorg/gatsby-theme/src/utils/shared/sidebar'

import { ReactComponent as LogoSVG } from '../../../../../static/img/logo-white.svg'
import menuData from '../../data/menu'

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
          href="/"
          className={styles.logo}
          aria-label="Home"
        >
          <LogoSVG />
        </Link>
        <LogoGradient href="https://dvc.ai">
          by <span className="font-extrabold">Iterative</span>
        </LogoGradient>
      </div>
      <ul className={styles.sections}>
        <li className={styles.section}>
          <Link
            href="/doc/use-cases"
            className={styles.sectionHeading}
            onClick={() => handleItemClick('use-cases')}
          >
            Use Cases
          </Link>
        </li>
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
          <Link
            href={blogsPageLink}
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
            href="/community"
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
                <img
                  className={styles.subSectionLinkImage}
                  src="/img/community/icon-mail.svg"
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
                  src="/img/community/icon-discord.svg"
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
