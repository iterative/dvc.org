import styled from 'styled-components'

import { LightButton } from '../styles'

export const Wrapper = styled.div`
  width: 170px;
  min-width: 170px;
  font-size: 16px;
  height: calc(100vh - 78px);
  position: sticky;
  top: 0;

  @media only screen and (max-width: 1200px) {
    display: none;
  }

  hr {
    opacity: 0.5;
  }
`

export const Header = styled.p`
  color: #3c3937;
  font-size: 14px;
  text-transform: uppercase;
  margin-top: 56px;
`

export const HeadingLink = styled.a`
  display: block;
  position: relative;
  font-size: 16px;
  font-weight: 500;
  color: #a0a8a5;
  text-decoration: none;
  font-weight: 400;
  line-height: 26px;
  min-height: 26px;
  margin-bottom: 3px;
  cursor: pointer;

  ${props =>
    props.isCurrent &&
    `
    color: #000;
  `}

  &:hover {
    color: #3c3937;
  }
`

export const ExternalButton = styled(LightButton)`
  box-sizing: border-box;
  min-width: 170px;
  margin: 10px 0;
`

export const GithubButton = styled(ExternalButton)`
  i {
    background-image: url(/img/github_icon.svg);
  }
`

export const DiscordButton = styled(ExternalButton)`
  i {
    background-image: url(/img/discord.svg);
    width: 1.2em;
    height: 1.2em;
  }
`

export const Spacer = styled.div`
  height: 65px;
`

export const Description = styled.p`
  color: #3c3937;
`
