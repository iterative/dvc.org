import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import useStars from '../../../../gatsby/hooks/stars'

import * as styles from './styles.module.css'

const formatter = Intl.NumberFormat('en-US')

const GithubLine: React.FC = () => {
  const stars = useStars()

  return (
    <div className={styles.container}>
      <img className={styles.githubLogo} src="/img/github_small.png" alt="" />
      We’re on
      <Link href="https://github.com/iterative/dvc" className={styles.link}>
        GitHub
      </Link>
      {stars && (
        <span
        //  className={styles.starCount}
        >
          <img className={styles.starIcon} src="/img/star_small.svg" alt="" />
          <span className={styles.count}>{formatter.format(stars)}</span>
        </span>
      )}
    </div>
  )
}

export default GithubLine
