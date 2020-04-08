import React, { useEffect, useState } from 'react'
import fetch from 'isomorphic-fetch'
import Link from '../../../Link'

import styles from './styles.module.css'

const repo = `iterative/dvc`
const gh = `https://github.com/${repo}`
const api = `https://api.github.com/repos/${repo}`

const GithubLine: React.SFC = () => {
  const [count, setCount] = useState('–––')

  useEffect(() => {
    fetch(api)
      .then(res => res.json())
      .then(data => setCount(data.stargazers_count))
  }, [count, setCount])

  return (
    <div className={styles.container}>
      <img className={styles.githubLogo} src="/img/github_small.png" alt="" />
      We’re on
      <Link href={gh} className={styles.link}>
        GitHub
      </Link>
      <img className={styles.starIcon} src="/img/star_small.svg" alt="" />
      <span className={styles.count}>{count}</span>
    </div>
  )
}

export default GithubLine
