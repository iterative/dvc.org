import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import Router from 'next/router'

import { media } from '../styles'
import DownloadButton from '../DownloadButton'
import TextRotate from '../TextRotate'

const getStarted = () => {
  window.scrollTo(0, 0)
  Router.push('/documentation')
}

export default ({}) => (
  <LandingHero>
    <About>
      <Title>
       Open-source Version Control System for Data Science Projects.
      </Title>
      <Buttons>
        <OnlyMobile>
          <GetStartedButton onClick={() => getStared()}>
            Get started
          </GetStartedButton>
        </OnlyMobile>
        <OnlyDesktop>
          <DownloadButton />
        </OnlyDesktop>
        <WatchButton href="#video">
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
    </About>

    <Commands>
      <Command level={1} active>
        <Line>$ dvc add images.z|</Line>
      </Command>
      <Command level={2}>
        <Line>$ dvc run python cnn.py</Line>
      </Command>
      <Command level={3}>
        <Line>$ dvc remote add s3_cnn s3://mybucket</Line>
      </Command>
      <Command level={4}>
        <Line>$ dvc push</Line>
      </Command>
    </Commands>
  </LandingHero>
)

const OnlyMobile = styled.div`
  display: none;
  ${media.giant`display: none;`};
  ${media.desktop`display: none;`};
  ${media.tablet`display: none;`};
  ${media.phablet`display: initial;`};
  ${media.phone`display: initial;`};
`

const OnlyDesktop = styled.div`
  display: initial;
  ${media.giant`display: initial;`};
  ${media.desktop`display: initial;`};
  ${media.tablet`display: initial;`};
  ${media.phablet`display: none;`};
  ${media.phone`display: none;`};
`

const LandingHero = styled.div`
  padding-top: 146px;
  padding-bottom: 166px;

  display: flex;

  ${media.phablet`
    flex-direction: column;
    padding-top: 46px;
    padding-bottom: 66px;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    flex-direction: column;
    padding-top: 46px;
    padding-bottom: 66px;
  }
`

const About = styled.div`
  flex-basis: 640px;

  ${media.phablet`
    flex-basis: none;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    flex-basis: none;
    max-width: 362px;
    margin: 0px auto;
  }
`

const Title = styled.h1`
  font-size: 40px;
  font-weight: 500;
  color: #40364d;
  font-family: BrandonGrotesqueMed;
  padding-right: 2em;

  ${media.phablet`
    font-size: 22px;
    padding: 0px;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    font-size: 22px;
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
    justify-content: center;
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
  font-size: 20px;
  font-weight: 500;
  line-height: 0.9;
`
const Description = styled.p`
  font-size: 14px;
  text-align: left;
`

const WatchButton = styled.a`
  ${actionButton};
  text-decoration: none;
  color: #40364d;
  background-color: transparent;
  margin-left: 15px;
  border: solid 2px rgba(176, 184, 197, 0.47);
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
`

export const keyFrameExampleOne = keyframes`
  0% {
    opacity: 1;
    color: #40364d;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #945dd6;
  }
  
  40% {
    border: 1px solid transparent;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
    color: #b4b9c4;
  }
  
  60% {
    opacity: 0.53;
    color: #b4b9c4;
  }
  
  80% {
    opacity: 0.28;
    color: #b4b9c4;
  }
`

const Command = styled.div`
  width: 362px;
  height: 57px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid transparent;
  margin-bottom: 13px;

  display: flex;
  align-items: center;

  ${media.phablet`
    width: 100%;
  `} opacity: 0.28;
  color: #b4b9c4;

  animation: ${keyFrameExampleOne} 9s ease-in-out 0s infinite;
  animation-delay: ${props => props.level * 2}s;
`

const Commands = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 10px;
  font-family: monospace, monospace;

  ${media.phablet`
    align-items: center;
    padding-top: 24px;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    align-items: center;
    padding-top: 24px;
  }
`

const Line = styled.span`
  font-size: 15px;
  font-weight: 500;
  padding: 0px 0px 0px 12px;
`
