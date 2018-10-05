import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import { media, OnlyDesktop, OnlyMobile } from '../styles'
import DownloadButton from '../DownloadButton'
import GithubLine from '../GithubLine'
import { logEvent } from "../utils/ga";
import { scroller } from 'react-scroll'

export default class LandingHero extends Component {
  state = {
    activeCommand: 0
  }

  componentDidMount() {
    this.commandsFadeInterval = setInterval(() => {
      this.setState((prevState) => ({
        activeCommand: (prevState.activeCommand + 1) % 4
      }))
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.commandsFadeInterval);
  }

  getStarted = () => {
    window.location =
      '/doc/get-started'
  }

  scrollToVideo = () => {
    logEvent('button', 'how-it-works')
    scroller.scrollTo('how-it-works', {
      duration: 800,
      offset: -75,
      delay: 0,
      smooth: 'easeInOut',
      containerId: 'bodybag',
    })
  }

  render() {
    const { activeCommand } = this.state;

    return (
      <Wrapper>
        <About>
          <Title>
            Open-source <br/> Version Control System <br/> for Machine Learning Projects
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
                  src="/static/img/play-icon.svg"
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
              <Line>$ dvc add images.zip</Line>
            </Command>
            <Command active={activeCommand === 1}>
              <Line>$ dvc run -d images.zip -o model.p ./cnn.py</Line>
            </Command>
            <Command active={activeCommand === 2}>
              <Line>$ dvc remote add myrepo s3://mybucket</Line>
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

const Wrapper = styled.div`
  padding-top: 136px;
  padding-bottom: 146px;

  display: flex;
  justify-content: space-between;

  ${media.tablet`
    flex-direction: column;
    padding-top: 46px;
    padding-bottom: 86px;
  `};
`

const About = styled.div`
  ${media.tablet`
    max-width: 412px;
    width: 100%;
    margin: 0px auto;
  `};
`

const Title = styled.h1`
  font-size: 40px;
  font-weight: 500;
  color: #40364d;
  font-family: BrandonGrotesqueMed;
  padding-right: 2em;

  ${media.tablet`
    padding-right: 0;
    font-size: 36px;
  `};

  ${media.phablet`
    font-size: 32px;
    padding: 0px;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    font-size: 34px;
    padding: 0px;
  }
`

const Buttons = styled.div`
  margin-top: 28px;
  display: flex;

  ${media.phablet`
    flex-direction: column;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    justify-content: flex-start;
  }
`

const actionButton = css`
  cursor: pointer;
  align-items: center;
  min-width: 186px;
  border-radius: 4px;
  border: none;

  display: flex;
  flex-direction: row;
  padding: 0px;

  ${media.phablet`
    margin: 0px;
    margin-bottom: 12px;
    max-width: none;
    min-height: 60px;
  `};
`

const ActionIcon = styled.div`
  flex-basis: 48px;

  text-align: center;
`

const ActionInner = styled.div``
const Action = styled.h6`
  font-family: BrandonGrotesqueMed;
  font-size: 20px;
  line-height: 0.9;
`
const Description = styled.p`
  font-family: BrandonGrotesque;
  font-weight: normal;
  font-size: 14px;
  text-align: left;
`

const WatchButton = styled.a`
  ${actionButton};
  height: 56px;
  text-decoration: none;
  color: #40364d;
  background-color: #eef4f8;
  margin-left: 15px;
  border: solid 2px rgba(176, 184, 197, 0.47);
  transition: 0.2s background-color ease-out;

  &:hover {
    background-color: #e4eaee;
  }

  ${ActionIcon} {
    padding-top: 6px;
  }
`

const GetStartedButton = styled.a`
  ${actionButton};
  text-decoration: none;
  background-color: #13adc7;
  display: flex;
  padding: 0px 0px 0px 20px;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  line-height: 0.9;
  border: solid 2px transparent;
  transition: 0.2s background-color ease-out;
  
  &:hover {
    background-color: #13A3BD
  }
`

const Command = styled.div`
  width: 100%;
  height: 57px;
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px ${({ active }) => active ? '#945dd6' : 'transparent'};
  margin-bottom: 13px;
  color: ${({ active }) => active ? '#40364d' : '#b4b9c4'};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  transform: translateZ(0);
  display: flex;
  align-items: center;
  opacity: ${({ active }) => active ? 1 : 0.30};
  transition: opacity 3s, border .5s, color 1s;
`

const Commands = styled.div`
  flex: 1 1 auto;
  max-width: 412px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 10px;
  font-family: monospace, monospace;

  ${media.tablet`
    align-items: center;
    padding-top: 24px;
    margin: 30px auto 0;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    align-items: center;
    padding-top: 24px;
  }
`

const Line = styled.span`
  font-size: 15px;
  font-weight: 700;
  padding: 0px 10px 0px 12px;
`

const Github = styled.div`
  margin-top: 51px;
  font-size: 14px;
  font-weight: 500;
  color: #b0b8c5;

  ${media.tablet`
    align-items: center;
    margin-top: 24px;
    font-size: 18px;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    align-items: center;
    margin-top: 24px;
    font-size: 18px;
  }
`
