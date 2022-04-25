import cn from 'classnames'
import React, { useEffect, useState, useCallback, MouseEvent } from 'react'

import HamburgerIcon from 'gatsby-theme-iterative-docs/src/components/HamburgerIcon'
import Link from 'gatsby-theme-iterative-docs/src/components/Link'
import { logEvent } from 'gatsby-theme-iterative-docs/src/utils/front/plausible'

import { getFirstPage } from 'gatsby-theme-iterative-docs/src/utils/shared/sidebar'
import { ReactComponent as LogoSVG } from '../../../static/img/logo-white.svg'
import { ReactComponent as TwitterIcon } from 'gatsby-theme-iterative-docs/src/components/SocialIcon/twitter.svg'
import { ReactComponent as GithubIcon } from 'gatsby-theme-iterative-docs/src/components/SocialIcon/github.svg'

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

  const handleClose = useCallback(() => setOpened(false), [opened])

  const handleItemClick = useCallback(
    item => (): void => {
      handleClose()
      if (item) {
        logEvent('Hamburger Menu', { Item: item })
      }
    },
    []
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
        <Link
          className={styles.company}
          href="https://iterative.ai/"
          target="_blank"
        >
          by <span className={styles.companyName}>iterative.ai</span>
        </Link>
      </div>
      <ul className={styles.sections}>
        <li className={styles.section}>
          <Link
            href="/features"
            className={styles.sectionHeading}
            onClick={() => handleItemClick('features')}
          >
            Features
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
            href="/blog"
            className={styles.sectionHeading}
            onClick={() => handleItemClick('blog')}
          >
            Blog
          </Link>
        </li>
        <li className={styles.section}>
          <Link
            href="https://learn.iterative.ai/"
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
            <li className={styles.subSection}>
              <Link
                href="/community#meet"
                className={styles.subSectionLink}
                onClick={() => handleItemClick('community')}
              >
                <img
                  className={styles.subSectionLinkImage}
                  src="/img/community/icon-community.svg"
                  alt=""
                />
                <span className={styles.subSectionLinkTitle}>Meet Us</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link
                href="/community#contribute"
                className={styles.subSectionLink}
                onClick={() => handleItemClick('community')}
              >
                <img
                  className={styles.subSectionLinkImage}
                  src="/img/community/icon-contribute.svg"
                  alt=""
                />
                <span className={styles.subSectionLinkTitle}>Contribute</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link
                href="/community#learn"
                className={styles.subSectionLink}
                onClick={() => handleItemClick('community')}
              >
                <img
                  className={styles.subSectionLinkImage}
                  src="/img/community/icon-learn.svg"
                  alt=""
                />
                <span className={styles.subSectionLinkTitle}>Learn</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link
                href="/community#events"
                className={styles.subSectionLink}
                onClick={() => handleItemClick('community')}
              >
                <img
                  className={styles.subSectionLinkImage}
                  src="/img/community/icon-events.svg"
                  alt=""
                />
                <span className={styles.subSectionLinkTitle}>Events</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link
                href="/community#testimonial"
                className={styles.subSectionLink}
                onClick={() => handleItemClick('community')}
              >
                <img
                  className={styles.subSectionLinkImage}
                  src="/img/community/icon-community.svg"
                  alt=""
                />
                <span className={styles.subSectionLinkTitle}>Testimonials</span>
              </Link>
            </li>
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
                  src="/img/studio_icon-color--square_vector.svg"
                  alt="Studio logo"
                />
                <span className={styles.subSectionLinkTitle}>Studio</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link href="/" className={styles.subSectionLink}>
                <img
                  className={styles.subSectionLinkImage}
                  src="/img/dvc_icon-color--square_vector.svg"
                  alt="DVC logo"
                />
                <span className={styles.subSectionLinkTitle}>DVC</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link href="https://cml.dev/" className={styles.subSectionLink}>
                <img
                  className={styles.subSectionLinkImage}
                  src="/img/cml_icon-color--square_vector.svg"
                  alt="CML logo"
                />
                <span className={styles.subSectionLinkTitle}>CML</span>
              </Link>
            </li>
            <li className={styles.subSection}>
              <Link href="https://mlem.ai/" className={styles.subSectionLink}>
                <img
                  className={styles.subSectionLinkImage}
                  src="/img/mlem-icon.svg"
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
