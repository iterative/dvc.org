import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const repo = `iterative/dvc`
const gh = `https://github.com/${repo}`
const api = `https://api.github.com/repos/${repo}`

export default function GithubLine() {
  const [count, setCount] = useState('–––')

  useEffect(() => {
    fetch(api).then(res => {
      res.json().then(({ stargazers_count }) => setCount(stargazers_count))
    })
  }, [count, setCount])

  return (
    <Wrapper>
      <Github src="/static/img/github_small.png" width="20" height="20" />
      We’re on
      <Link href={gh}>GitHub</Link>
      <Star
        src="/static/img/star_small.svg"
        width="11.74"
        height="11.74"
      />{' '}
      <Count>{count}</Count>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  font-family: BrandonGrotesqueMed;
  line-height: 20px;
  height: 20px;
  display: flex;
  align-items: center;
`

const Link = styled.a`
  font-family: BrandonGrotesqueMed;
  color: #40364d;
  margin-left: 0.3em;

  &:focus,
  &:hover,
  &:visited {
    color: #40364d;
  }
`

const Github = styled.img`
  font-family: BrandonGrotesqueMed;
  margin-right: 9px;
`

const Star = styled.img`
  margin-left: 7px;
`

const Count = styled.span`
  font-family: BrandonGrotesqueMed;
  margin-left: 6.3px;
`
