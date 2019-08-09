import React from 'react'
import styled from 'styled-components'
import { LightButton } from '../LightButton'

const ROOT_ELEMENT = 'bodybag'
const MARKDOWN_ROOT = '.markdown-body'

const imageChecker = (images, callback) => {
  if (images.length) {
    let counter = images.length

    const unsubscribe = () => {
      images.forEach(img => {
        img.removeEventListener('load', decrement)
        img.removeEventListener('error', decrement)
      })
    }

    const decrement = e => {
      counter -= 1

      if (!counter) {
        callback()
        unsubscribe()
      }
    }

    images.forEach(img => {
      img.addEventListener('load', decrement)
      img.addEventListener('error', decrement)
    })

    setTimeout(() => {
      if (counter) unsubscribe()
    }, 5000)
  }
}

export default class RightPanel extends React.PureComponent {
  state = {
    height: 0,
    coordinates: {},
    current: undefined
  }
  componentDidMount() {
    this.root = document.getElementById(ROOT_ELEMENT)

    if (this.props.headings.length) {
      this.initHeadingsPosition()
    }

    this.root.addEventListener('scroll', this.setCurrentHeader)
    window.addEventListener('resize', this.updateHeadingsPosition)
  }

  componentDidUpdate(prevProps) {
    if (this.props.headings != prevProps.headings) {
      this.initHeadingsPosition()
    }
  }

  componentWillUnmount() {
    this.root.removeEventListener('scroll', this.setCurrentHeader)
    window.removeEventListener('resize', this.updateHeadingsPosition)
  }

  initHeadingsPosition = () => {
    const images = document.querySelectorAll(`${MARKDOWN_ROOT} img`)

    if (images.length) {
      imageChecker(images, this.updateHeadingsPosition)
    } else {
      this.updateHeadingsPosition()
    }
  }

  updateHeadingsPosition = () => {
    const coordinates = this.props.headings.reduce((result, { slug }) => {
      return { ...result, [document.getElementById(slug).offsetTop]: slug }
    }, {})

    const height = this.root.offsetHeight

    this.setState({ coordinates, height }, this.setCurrentHeader)
  }

  setCurrentHeader = () => {
    const { coordinates, height } = this.state
    const { scrollTop } = this.root
    const coordinateKeys = Object.keys(coordinates)

    if (!coordinateKeys.length) return

    const filteredKeys = coordinateKeys.filter(
      top => top <= scrollTop + height / 2
    )

    const current = filteredKeys.length
      ? coordinates[filteredKeys[filteredKeys.length - 1]]
      : undefined

    this.setState({ current })
  }

  render() {
    const { headings, scrollToLink, githubLink } = this.props
    const { current } = this.state

    return (
      <Wrapper>
        {headings.length ? (
          <>
            <Header>Content</Header>
            <hr />
            {headings.map(({ slug, text }, headingIndex) => (
              <HeadingLink
                isCurrent={current === slug}
                level={3}
                key={`link-${headingIndex}`}
                onClick={() => scrollToLink(slug)}
                href={`#${slug}`}
              >
                {text}
              </HeadingLink>
            ))}
            <br />
          </>
        ) : (
          <>
            <Spacer />
          </>
        )}

        <Description>Found an issue? Let us know or fix it:</Description>

        <GithubButton href={githubLink} target="_blank">
          <i />
          Edit on Github
        </GithubButton>

        <br />
        <br />
        <Description>
          Have a question? Join our chat, we will help you:
        </Description>

        <DiscordButton href="/chat" target="_blank">
          <i />
          Discord Chat
        </DiscordButton>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
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

const Header = styled.p`
  color: #3c3937;
  font-size: 14px;
  text-transform: uppercase;
  margin-top: 56px;
`

const HeadingLink = styled.a`
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

const GithubButton = styled(LightButton)`
  min-width: 120px;
  margin: 10px 0;

  i {
    background-image: url(/static/img/github_icon.svg);
  }
`

const DiscordButton = styled(LightButton)`
  min-width: 120px;
  margin: 10px 0;

  i {
    background-image: url(/static/img/discord.svg);
    width: 1.2em;
    height: 1.2em;
  }
`

const Spacer = styled.div`
  height: 65px;
`

const Description = styled.p`
  color: #3c3937;
`
