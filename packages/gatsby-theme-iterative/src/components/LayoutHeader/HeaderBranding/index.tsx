import cn from 'classnames'

import { ReactComponent as LogoSVG } from '../../../images/dvc_icon-color--square_vector.svg'
import Link from '../../Link'

import * as styles from './styles.module.css'

export const HeaderBranding = () => (
  <>
    <Link
      href="/"
      className={cn(styles.logoLink, 'mr-auto')}
      title="DVC"
      aria-label="DVC"
    >
      <LogoSVG className={styles.logo} />
    </Link>
  </>
)
