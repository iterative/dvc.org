import cn from 'classnames'

import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import SocialIcon, {
  ISocialIcon
} from '@dvcorg/gatsby-theme-iterative/src/components/SocialIcon'
import ShowOnly from '@dvcorg/gatsby-theme-iterative/src/components/ShowOnly'
import { getFirstPage } from '@dvcorg/gatsby-theme-iterative/src/utils/shared/sidebar'

import { ReactComponent as LogoSVG } from '../../../../../static/img/dvc_icon-color--square_vector.svg'
import { ReactComponent as GithubSVG } from '@dvcorg/gatsby-theme-iterative/src/components/SocialIcon/github.svg'
import { ReactComponent as TwitterSVG } from '@dvcorg/gatsby-theme-iterative/src/components/SocialIcon/twitter.svg'
import { ReactComponent as DiscordSVG } from '@dvcorg/gatsby-theme-iterative/src/components/SocialIcon/discord.svg'
import { ReactComponent as StudioSVG } from '../../../../../static/img/studio_icon-color--square_vector.svg'
import { ReactComponent as DatachainSVG } from '../../../../../static/img/logos/datachain.svg'

import * as styles from '@dvcorg/gatsby-theme-iterative/src/components/LayoutFooter/styles.module.css'
import LogoGradient from '@dvcorg/gatsby-theme-iterative/src/components/LogoGradient'

import { githubDatachainUrl } from '../../../../utils/externalUrls'

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
    header: 'Product',
    links: [
      {
        href: '/',
        text: 'Overview'
      },
      {
        href: '/doc/use-cases',
        text: 'Use Cases'
      }
    ]
  },
  {
    header: 'Help',
    links: [
      { href: '/support', text: 'Support' },
      { href: '/doc/start', text: 'Get started' },
      { href: '/community', text: 'Community' },
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
        href: '/blog',
        text: 'Blog'
      },
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
    header: 'More Tools',
    links: [
      {
        href: githubDatachainUrl,
        text: 'DataChain',
        icon: <DatachainSVG className={styles.productIcon} />
      },
      {
        href: 'https://studio.iterative.ai/',
        text: 'DVC Studio',
        icon: <StudioSVG className={styles.productIcon} />,
        target: '_blank'
      },
      {
        href: 'https://marketplace.visualstudio.com/items?itemName=Iterative.dvc',
        text: 'VS Code Extension',
        icon: <LogoSVG className={styles.productIcon} />,
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
    url: 'https://www.linkedin.com/company/dvc-ai'
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
        <p className={styles.companyLabel}>
          By{' '}
          <LogoGradient className="font-extrabold" href="https://dvc.ai">
            Iterative
          </LogoGradient>
          <span className={styles.companyDescription}>
            <ShowOnly as="span" on="desktop">
              {' '}
              - an open platform to operationalize AI
            </ShowOnly>
            <ShowOnly as="span" on="mobile">
              {' '}
              An open platform to operationalize AI
            </ShowOnly>
          </span>
        </p>
        <FooterSocialIcons />
      </div>
    </LayoutWidthContainer>
  </footer>
)

export default LayoutFooter
