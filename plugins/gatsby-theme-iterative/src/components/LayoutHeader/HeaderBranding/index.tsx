import Link from '../../Link'
import { ReactComponent as LogoSVG } from '../../../images/dvc_icon-color--square_vector.svg'
import * as styles from './styles.module.css'
import cn from 'classnames'

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
