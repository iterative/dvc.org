import cn from 'classnames'

import {
  externalUrls,
  mainSiteUrls,
  docUrls
} from '@dvcorg/gatsby-theme/consts'
import SocialIcon, {
  ISocialIcon
} from '@dvcorg/gatsby-theme/src/components/SocialIcon'

import { ReactComponent as LogoSVG } from '../../../../../static/img/dvc_by_lakefs_white.svg'
import LayoutWidthContainer from '../LayoutWidthContainer'
import Link from '../Link'
import { ReactComponent as DiscordSVG } from '../SocialIcon/discord.svg'
import { ReactComponent as GithubSVG } from '../SocialIcon/github.svg'
import { ReactComponent as TwitterSVG } from '../SocialIcon/twitter.svg'

import * as styles from './styles.module.css'

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
    header: 'Product',
    links: [
      {
        href: mainSiteUrls.home,
        text: 'Overview'
      },
      {
        href: docUrls.useCases,
        text: 'Use Cases'
      },
      {
        href: mainSiteUrls.blog,
        text: 'Blog'
      }
    ]
  },
  {
    header: 'Help',
    links: [
      { href: mainSiteUrls.support, text: 'Support' },
      { href: docUrls.getStarted, text: 'Get started' },
      { href: mainSiteUrls.community, text: 'Community' },
      { href: docUrls.home, text: 'Documentation' }
    ]
  },
  {
    header: 'Community',
    links: [
      {
        href: externalUrls.twitter,
        text: 'Twitter',
        icon: <TwitterSVG className={styles.icon} />,
        target: '_blank'
      },
      {
        href: externalUrls.dvcRepo,
        text: 'Github',
        icon: <GithubSVG className={styles.icon} />,
        target: '_blank'
      },
      {
        href: mainSiteUrls.chat,
        text: 'Discord',
        icon: <DiscordSVG className={styles.icon} />
      }
    ]
  },
  {
    header: 'Legal',
    links: [{ href: externalUrls.privacyPolicy, text: 'Privacy Policy' }]
  }
]

const footerSocialIconsData: Array<ISocialIcon> = [
  {
    site: 'github',
    label: 'DVC Github Page',
    url: externalUrls.dvcRepo
  },
  {
    site: 'twitter',
    label: 'DVC Twitter',
    url: externalUrls.twitter
  },
  {
    site: 'youtube',
    label: 'DVC.org Youtube Channel',
    url: externalUrls.youtube
  },
  {
    site: 'discord',
    label: 'DVC Discord chat',
    url: mainSiteUrls.chat
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
        <Link className={styles.logo} href={mainSiteUrls.home} title="dvc.org">
          <LogoSVG />
        </Link>
      </div>
      <FooterLists />

      <div className="mx-auto mt-6">
        <FooterSocialIcons />
      </div>
    </LayoutWidthContainer>
  </footer>
)

export default LayoutFooter
