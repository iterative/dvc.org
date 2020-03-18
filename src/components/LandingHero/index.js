import React, { Component } from 'react'
import { scroller } from 'react-scroll'

import DownloadButton from '../DownloadButton'
import GithubLine from '../GithubLine'

import { logEvent } from '../../utils/ga'

import { OnlyDesktop, OnlyMobile } from '../../styles'
import {
  Wrapper,
  About,
  Title,
  Buttons,
  GetStartedButton,
  WatchButton,
  Action,
  ActionIcon,
  ActionInner,
  Description,
  Github,
  Command,
  Commands,
  Line
} from './styles'

export default class LandingHero extends Component {
  state = {
    activeCommand: 0
  }

  componentDidMount() {
    this.commandsFadeInterval = setInterval(() => {
      this.setState(prevState => ({
        activeCommand: (prevState.activeCommand + 1) % 4
      }))
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.commandsFadeInterval)
  }

  getStarted = () => {
    window.location = '/doc/get-started'
  }

  scrollToVideo = () => {
    logEvent('button', 'how-it-works')
    scroller.scrollTo('how-it-works', {
      duration: 800,
      offset: -75,
      delay: 0,
      smooth: 'easeInOut',
      containerId: 'bodybag'
    })
  }

  render() {
    const { activeCommand } = this.state

    return (
      <Wrapper>
        <About>
          <Title>
            Open-source
            <br />
            Version Control System
            <br />
            for Machine Learning Projects
          </Title>
          <Buttons>
            <OnlyMobile>
              <GetStartedButton onClick={this.getStarted}>
                Get started
              </GetStartedButton>
            </OnlyMobile>
            <OnlyDesktop>
              <DownloadButton />
            </OnlyDesktop>
            <WatchButton onClick={this.scrollToVideo}>
              <ActionIcon>
                <img
                  src="/img/play-icon.svg"
                  alt="Watch video"
                  width={20}
                  height={20}
                />
              </ActionIcon>
              <ActionInner>
                <Action>Watch video</Action>
                <Description>How it works</Description>
              </ActionInner>
            </WatchButton>
          </Buttons>

          <Github>
            <GithubLine />
          </Github>
        </About>

        <OnlyDesktop>
          <Commands>
            <Command active={activeCommand === 0}>
              <Line>$ dvc add images</Line>
            </Command>
            <Command active={activeCommand === 1}>
              <Line>$ dvc run -d images -o model.p cnn.py</Line>
            </Command>
            <Command active={activeCommand === 2}>
              <Line>$ dvc remote add -d myrepo s3://mybucket</Line>
            </Command>
            <Command active={activeCommand === 3}>
              <Line>$ dvc push</Line>
            </Command>
          </Commands>
        </OnlyDesktop>
      </Wrapper>
    )
  }
}
