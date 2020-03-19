import React from 'react'
import Promise from 'promise'
import PropTypes from 'prop-types'
import throttle from 'lodash.throttle'

import Tutorials from '../Tutorials'

import {
  Description,
  DiscordButton,
  GithubButton,
  Header,
  HeadingLink,
  Spacer,
  Wrapper
} from './styles'

const ROOT_ELEMENT = 'bodybag'
const MARKDOWN_ROOT = '#markdown-root'

const imageLoaded = url =>
  new Promise(resolve => {
    let img = new Image()

    img.addEventListener('load', function onLoad() {
      resolve()
      img.removeEventListener('load', onLoad)
      img = null
    })
    img.addEventListener('error', function onError() {
      resolve()
      img.removeEventListener('error', onError)
      img = null
    })
    img.src = url
  })

const allImagesLoaded = urls => Promise.all(urls.map(imageLoaded))

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
    if (this.props.headings !== prevProps.headings) {
      this.initHeadingsPosition()
    }
  }

  componentWillUnmount() {
    this.root.removeEventListener('scroll', this.setCurrentHeader)
    window.removeEventListener('resize', this.updateHeadingsPosition)
  }

  initHeadingsPosition = () => {
    const imagesUrls = Array.from(
      document.querySelectorAll(`${MARKDOWN_ROOT} img`)
    ).map(img => img.src)

    if (imagesUrls.length) {
      allImagesLoaded(imagesUrls).then(this.updateHeadingsPosition)
    } else {
      this.updateHeadingsPosition()
    }
  }

  updateHeadingsPosition = () => {
    const coordinates = this.props.headings.reduce((result, { slug }) => {
      const headingElement = document.getElementById(slug)

      return { ...result, [headingElement && headingElement.offsetTop]: slug }
    }, {})

    const height = this.root.offsetHeight

    this.setState({ coordinates, height }, this.setCurrentHeader)
  }

  setCurrentHeader = throttle(() => {
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
  }, 100)

  render() {
    const { headings, githubLink, tutorials } = this.props
    const { current } = this.state

    return (
      <Wrapper>
        {!headings.length && <Spacer />}
        {headings.length > 0 && (
          <>
            <Header>Content</Header>
            <hr />
            {headings.map(({ slug, text }) => (
              <HeadingLink
                isCurrent={current === slug}
                level={3}
                key={`link-${slug}`}
                href={`#${slug}`}
              >
                {text}
              </HeadingLink>
            ))}
            <br />
          </>
        )}
        {Object.keys(tutorials || {}).length > 0 && (
          <>
            <Description>
              <span role="img" aria-label="bug">
                ▶️
              </span>{' '}
              It can be run online:
            </Description>
            <Tutorials tutorials={tutorials} />
            <br />
          </>
        )}
        <Description>
          <span role="img" aria-label="bug">
            🐛
          </span>{' '}
          Found an issue? Let us know! Or fix it:
        </Description>

        <GithubButton href={githubLink} target="_blank">
          <i />
          Edit on GitHub
        </GithubButton>

        <br />
        <br />
        <Description>
          <span role="img" aria-label="question">
            ❓
          </span>{' '}
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

RightPanel.propTypes = {
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ).isRequired,
  tutorials: PropTypes.object,
  githubLink: PropTypes.string.isRequired
}
