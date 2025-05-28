import React from 'react'
import cn from 'classnames'

import LayoutWidthContainer from '../LayoutWidthContainer'
import Link from '../Link'
import SocialIcon, { ISocialIcon } from '../SocialIcon'
import { getFirstPage } from '../../utils/shared/sidebar'

import { ReactComponent as LogoSVG } from '../../images/dvc_icon-color--square_vector.svg'
import { ReactComponent as GithubSVG } from '../SocialIcon/github.svg'
import { ReactComponent as TwitterSVG } from '../SocialIcon/twitter.svg'
import { ReactComponent as DiscordSVG } from '../SocialIcon/discord.svg'
import { ReactComponent as CmlSVG } from '../../images/cml_icon-color--square_vector.svg'
import { ReactComponent as StudioSVG } from '../../images/studio_icon-color--square_vector.svg'
import { ReactComponent as MlemSVG } from '../../images/mlem-icon.svg'

import * as styles from './styles.module.css'

const docsPage = getFirstPage()

interface IFooterLinkData {
  href: string
  text: string
  icon?: JSX.Element
  target?: '_blank'
}

interface IFooterListData {
  header: string
  links: Array<IFooterLinkData>
}

const footerListsData: Array<IFooterListData> = [
  {
    header: 'Help',
    links: [
      { href: '/doc/start', text: 'Get started' },
      { href: docsPage, text: 'Documentation' }
    ]
  },
  {
    header: 'Community',
    links: [
      {
        href: 'https://twitter.com/DVCorg',
        text: 'Twitter',
        icon: <TwitterSVG className={styles.icon} />,
        target: '_blank'
      },
      {
        href: 'https://github.com/iterative/dvc',
        text: 'Github',
        icon: <GithubSVG className={styles.icon} />,
        target: '_blank'
      },
      {
        href: '/chat',
        text: 'Discord',
        icon: <DiscordSVG className={styles.icon} />
      }
    ]
  },
  {
    header: 'Company',
    links: [
      {
        href: '/doc/user-guide/privacy',
        text: 'Privacy Policy'
      },
      {
        href: 'https://iterative.ai/about#career',
        text: 'Career',
        target: '_blank'
      },
      {
        href: 'https://iterative.ai/brand',
        text: 'Media Kit'
      }
    ]
  },
  {
    header: 'Other Tools',
    links: [
      {
        href: '/',
        text: 'DVC',
        icon: <LogoSVG className={styles.productIcon} />
      },
      {
        href: 'https://cml.dev/',
        text: 'CML',
        icon: <CmlSVG className={styles.productIcon} />,
        target: '_blank'
      },
      {
        href: 'https://studio.iterative.ai/',
        text: 'Studio',
        icon: <StudioSVG className={styles.productIcon} />,
        target: '_blank'
      },
      {
        href: 'https://mlem.ai/',
        text: 'MLEM',
        icon: <MlemSVG className={styles.productIcon} />,
        target: '_blank'
      }
    ]
  }
]

const footerSocialIconsData: Array<ISocialIcon> = [
  {
    site: 'github',
    label: 'DVC Github Page',
    url: 'https://github.com/iterative/dvc'
  },
  {
    site: 'twitter',
    label: 'DVC Twitter',
    url: 'https://twitter.com/DVCorg'
  },
  {
    site: 'youtube',
    label: 'DVC.org Youtube Channel',
    url: 'https://www.youtube.com/channel/UC37rp97Go-xIX3aNFVHhXfQ'
  },
  {
    site: 'linkedinNoBg',
    label: 'Iterative LinkedIn',
    url: 'https://www.linkedin.com/company/iterative-ai'
  },
  {
    site: 'discord',
    label: 'DVC Discord chat',
    url: 'https://www.dvc.org/chat'
  }
]

const FooterLists: React.FC = () => (
  <div className={styles.columns}>
    {footerListsData.map(({ header, links }, index) => (
      <div className={styles.column} key={index}>
        <h2 className={styles.heading}>{header}</h2>
        <ul className={styles.links}>
          {links.map(({ text, target, href, icon }, i) => (
            <li
              // className={styles.linkItem}
              key={i}
            >
              <Link target={target} href={href} className={styles.link}>
                {icon}
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)

const FooterSocialIcons: React.FC = () => (
  <div className={styles.socialIcons}>
    {footerSocialIconsData.map(({ site, label, url }, index) => (
      <SocialIcon
        key={index}
        site={site}
        label={label}
        url={url}
        className={cn(styles.link, styles.socialIcon)}
      />
    ))}
  </div>
)

const LayoutFooter: React.FC = () => (
  <footer className={styles.wrapper}>
    <LayoutWidthContainer className={cn(styles.container)} wide>
      <div
      //  className={styles.top}
      >
        <Link className={styles.logo} href="/" title="dvc.org">
          <LogoSVG />
        </Link>
      </div>
      <FooterLists />
      <div className={styles.bottomRow}>
        <FooterSocialIcons />
      </div>
    </LayoutWidthContainer>
  </footer>
)

export default LayoutFooter
