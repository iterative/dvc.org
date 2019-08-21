import React, { Component } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const repo = `iterative/dvc`
const gh = `https://github.com/${repo}`
const api = `https://api.github.com/repos/${repo}`

export default class GithubLine extends Component {
  static defaultProps = {}

  state = {
    count: `–––`
  }

  UNSAFE_componentWillMount() {
    axios.get(api).then(this.process)
  }

  process = res => {
    const count = res.data.stargazers_count
    this.setState({
      count
    })
  }

  render() {
    const { count } = this.state
    return (
      <Wrapper>
        <Github src="/static/img/github_small.png" width="20" height="20" />
        We’re on
        <Link href={gh}>Github</Link>
        <Star
          src="/static/img/star_small.svg"
          width="11.74"
          height="11.74"
        />{' '}
        <Count>{count}</Count>
      </Wrapper>
    )
  }
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
