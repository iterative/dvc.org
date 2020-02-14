import React, { Component } from 'react'
import PropTypes from 'prop-types'

import isClient from '../../utils/isClient'
import { logEvent } from '../../utils/ga'

import {
  Action,
  Button,
  Delimiter,
  Description,
  DownloadInput,
  DownloadLink,
  Handler,
  Icon,
  Inner,
  Links,
  Popup,
  Triangle
} from './styles'

const VERSION = `0.83.0`
const OSX = `osx`
const WINDOWS = `win`
const LINUX = `linux`
const LINUX_RPM = `linux_rpm`
const UNKNOWN = `...`
const LINE = `line`

const links = {
  [OSX]: {
    title: 'Mac OS',
    url: `https://github.com/iterative/dvc/releases/download/${VERSION}/dvc-${VERSION}.pkg`,
    download: true
  },
  [WINDOWS]: {
    title: 'Windows',
    url: `https://github.com/iterative/dvc/releases/download/${VERSION}/dvc-${VERSION}.exe`,
    download: true
  },
  [LINUX]: {
    title: 'Linux Deb',
    url: `https://github.com/iterative/dvc/releases/download/${VERSION}/dvc_${VERSION}_amd64.deb`,
    download: true
  },
  [LINUX_RPM]: {
    title: 'Linux RPM',
    url: `https://github.com/iterative/dvc/releases/download/${VERSION}/dvc-${VERSION}-1.x86_64.rpm`,
    download: true
  },
  [LINE]: {
    line: true
  },
  [UNKNOWN]: {
    title: 'pip, conda, brew',
    url: `/doc/install`,
    download: false
  }
}

export default class DownloadButton extends Component {
  state = {
    os: UNKNOWN,
    open: false,
    clicked: false
  }

  constructor() {
    super()

    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    const os = this.getSystemOS()
    this.setState({ os })

    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setRef = ref => (this.ref = ref)

  handleClickOutside = event => {
    if (this.ref && !this.ref.contains(event.target)) {
      if (this.state.open) {
        this.close()
      }
    }
  }

  getSystemOS = () => {
    let OSName = UNKNOWN
    if (!isClient) return OSName

    if (navigator.userAgent.indexOf('Win') !== -1) OSName = WINDOWS
    if (navigator.userAgent.indexOf('Mac') !== -1) OSName = OSX
    if (navigator.userAgent.indexOf('Linux') !== -1) OSName = LINUX

    return OSName
  }

  close = () => this.setState({ open: false })

  toggle = () => {
    if (!this.state.clicked) {
      logEvent('button', 'download')
    }
    this.setState(prevState => ({
      open: !prevState.open,
      clicked: true
    }))
  }

  download = id => {
    this.close()
    logEvent('download', id)
  }

  renderLinks = () => (
    <Links>
      {[UNKNOWN, LINE, OSX, WINDOWS, LINUX, LINUX_RPM].map(id => {
        const link = links[id]

        if (link.line) {
          return <Delimiter key={id} />
        }

        if (!link.url) {
          return (
            <DownloadInput
              readOnly
              key={id}
              value={link.title}
              onClick={function(e) {
                e.target.select()
                e.stopPropagation()
              }}
            />
          )
        }

        return (
          <DownloadLink
            download={link.download}
            key={id}
            href={link.url}
            onClick={() => this.download(id)}
            active={id === this.state.os}
          >
            {link.title}
          </DownloadLink>
        )
      })}
    </Links>
  )

  render() {
    const { openTop } = this.props
    const { os, open } = this.state
    const currentOS = links[os]

    return (
      <Handler onClick={this.toggle} ref={this.setRef}>
        <Button open={open}>
          <Icon>
            <img
              src="/static/img/download-arrow.svg"
              alt="Download"
              width={14}
              height={20}
            />
          </Icon>
          <Inner>
            <div>
              <Action>Download</Action>
              <Description>({currentOS.title})</Description>
            </div>

            <Triangle open={open}>
              <img src="/static/img/triangle.svg" alt="" />
            </Triangle>
          </Inner>
        </Button>
        {open && <Popup openTop={openTop}>{this.renderLinks()}</Popup>}
      </Handler>
    )
  }
}

DownloadButton.propTypes = {
  openTop: PropTypes.bool
}
