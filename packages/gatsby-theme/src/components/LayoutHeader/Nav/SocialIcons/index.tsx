import { externalUrls, mainSiteUrls } from '../../../../../consts'
import SocialIcon, { ISocialIconProps } from '../../../SocialIcon'

import * as styles from './styles.module.css'

const socialIconData: Array<ISocialIconProps> = [
  {
    site: 'github',
    label: 'Go to DVC Github page',
    url: externalUrls.dvcRepo
  },
  {
    site: 'discord',
    label: 'Go to DVC Discord page',
    url: mainSiteUrls.chat
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
