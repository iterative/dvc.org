import React from 'react'
import styled from 'styled-components'
import { media, container } from '../styles'

const os = `OS X`

export default ({}) => (
  <LandingHero>
    <About>
      <SubTitle>Git for Machine Learning.</SubTitle>
      <Title>
        Open-source Version Control System for Data Science Projects.
      </Title>
      <Buttons>
        <DownloadButton>
          <ActionIcon>
            <img
              src="/static/img/download-arrow.svg"
              alt="Download"
              width={14}
              height={20}
            />
          </ActionIcon>
          <ActionInner>
            <Action>Download</Action>
            <Description>({os})</Description>
          </ActionInner>
        </DownloadButton>
        <WatchButton>
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

const LandingHero = styled.div`
  padding-top: 146px;
  padding-bottom: 166px;

  display: flex;
`

const About = styled.div`
  flex-basis: 543px;
`

const SubTitle = styled.h3`
  height: 40px;
  font-size: 30px;
  color: #b0b8c5;
`

const Title = styled.h1`
  font-size: 40px;
  font-weight: 500;
  line-height: 1.4;
  color: #40364d;
`

const Buttons = styled.div`
  margin-top: 28px;
  display: flex;
`

const ActionButton = styled.button`
  cursor: pointer;
  align-items: center;
  width: 186px;
  height: 60px;
  border-radius: 4px;
  border: none;

  display: flex;
  flex-direction: row;
  padding: 0px;
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

const DownloadButton = ActionButton.extend`
  background-color: #945dd6;

  line-height: 1.29;
  color: #ffffff;
`

const WatchButton = ActionButton.extend`
  background-color: transparent;
  margin-left: 15px;
  border: solid 2px rgba(176, 184, 197, 0.47);
`

const Commands = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 40px;
`

const Command = styled.div`
  width: 362px;
  height: 57px;
  border-radius: 8px;
  background-color: #ffffff;
  margin-bottom: 13px;

  display: flex;
  align-items: center;
  padding: 0px 20px;

  ${props =>
    props.active &&
    `
       border: solid 1px #945dd6;
  `};
  
  ${props =>
    props.level === 1 &&
    `
    color: #40364d;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  `}
  
  ${props =>
    props.level === 2 &&
    `
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
    color: #b4b9c4;
  `}
  
  ${props =>
    props.level === 3 &&
    `
    
  opacity: 0.53;
    color: #b4b9c4;
     
  `}
  
  ${props =>
    props.level === 4 &&
    `
    opacity: 0.28;
      color: #b4b9c4;
  `}
`

const Line = styled.span`
  font-size: 20px;
  font-weight: 500;
`
