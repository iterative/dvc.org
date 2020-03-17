import React from 'react'
import { Element } from 'react-scroll'

import { default as YoutubeVideo } from '../Video'
import TextCollapse from '../TextCollapse'

import { OnlyDesktop, OnlyMobile } from '../../styles'

import {
  Case,
  Cases,
  Container,
  Description,
  FlexWrap,
  Heading,
  Icon,
  Right,
  Title,
  Top,
  Video,
  Wrapper
} from './styles'

const Heading1 = () => (
  <Top>
    <Icon>
      <img src="/img/save-reprro.svg" width={30} height={30} alt="" />
    </Icon>
    <Title>Save and reproduce your experiments</Title>
  </Top>
)

const Heading2 = () => (
  <Top>
    <Icon>
      <img src="/img/git-icon.svg" width={30} height={30} alt="" />
    </Icon>
    <Title>Version control models and data</Title>
  </Top>
)

const Heading3 = () => (
  <Top>
    <Icon>
      <img src="/img/share.svg" width={30} height={31} alt="" />
    </Icon>
    <Title>Establish workflow for deployment & collaboration</Title>
  </Top>
)

const Description1 = () => (
  <Description>
    At any time, fetch the full context about any experiment you or your
    colleagues have run. DVC guarantees that all files and metrics will be
    consistent and in the right place to reproduce the experiment or use it as a
    baseline for a new iteration.
  </Description>
)

const Description2 = () => (
  <Description>
    DVC keeps metafiles in Git instead of Google Docs to describe and version
    control your data sets and models. DVC supports a variety of external
    storage types as a remote cache for large files.
  </Description>
)

const Description3 = () => (
  <Description>
    DVC defines rules and processes for working effectively and consistently as
    a team. It serves as a protocol for collaboration, sharing results, and
    getting and running a finished model in a production environment.
  </Description>
)

export default function UseCases() {
  return (
    <Wrapper>
      <Element name="how-it-works" />

      <Container>
        <Heading>Use cases</Heading>
        <FlexWrap>
          <Video>
            <YoutubeVideo id={`4h6I9_xeYA4`} />
          </Video>

          <Right>
            <OnlyDesktop>
              <Cases>
                <Case>
                  <Heading1 />
                  <Description1 />
                </Case>
                <Case>
                  <Heading2 />
                  <Description2 />
                </Case>
                <Case>
                  <Heading3 />
                  <Description3 />
                </Case>
              </Cases>
            </OnlyDesktop>

            <OnlyMobile>
              <Cases>
                <Case>
                  <TextCollapse header={<Heading1 />}>
                    <Description1 />
                  </TextCollapse>
                </Case>
                <Case>
                  <TextCollapse header={<Heading2 />}>
                    <Description2 />
                  </TextCollapse>
                </Case>
                <Case>
                  <TextCollapse header={<Heading3 />}>
                    <Description3 />
                  </TextCollapse>
                </Case>
              </Cases>
            </OnlyMobile>
          </Right>
        </FlexWrap>
      </Container>
    </Wrapper>
  )
}
