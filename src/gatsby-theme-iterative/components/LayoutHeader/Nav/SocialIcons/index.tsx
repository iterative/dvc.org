import React from 'react'

import SocialIcon, {
  ISocialIconProps
} from 'gatsby-theme-iterative/src/components/SocialIcon'

import * as styles from './styles.module.css'

const socialIconData: Array<ISocialIconProps> = [
  {
    site: 'github',
    label: 'Go to DVC Github page',
    url: 'https://github.com/iterative/dvc'
  },
  {
    site: 'discord',
    label: 'Go to DVC Discord page',
    url: '/chat'
  }
]

const SocialIcons: React.FC = () => (
  <ul className={styles.socialIcons}>
    {socialIconData.map(({ site, label, url }, i) => (
      <li key={i}>
        <SocialIcon
          site={site}
          label={label}
          url={url}
          className={styles.socialIcon}
        />
      </li>
    ))}
  </ul>
)

export default SocialIcons
