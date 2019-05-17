import React from 'react'
import styled from 'styled-components'
import { media, container, OnlyDesktop, OnlyMobile } from '../styles'

import { default as YoutubeVideo } from '../Video'
import { Element } from 'react-scroll'
import TextCollapse from '../TextCollapse'

const Heading1 = () => (
  <Top>
    <Icon>
      <img src="/static/img/save-reprro.svg" width={30} height={30} />
    </Icon>
    <Title>Save and reproduce your experiments</Title>
  </Top>
)

const Heading2 = () => (
  <Top>
    <Icon>
      <img src="/static/img/git-icon.svg" width={30} height={30} />
    </Icon>
    <Title>Version control models and data</Title>
  </Top>
)

const Heading3 = () => (
  <Top>
    <Icon>
      <img src="/static/img/share.svg" width={30} height={31} />
    </Icon>
    <Title>Establish workflow for deployment & collaboration</Title>
  </Top>
)

const Description1 = () => (
  <Description>
    At any time, fetch the full context about any experiment you or your team
    has run. DVC guarantees that all files and metrics will be consistent and in
    the right place to reproduce the experiment or use it as a baseline for a
    new iteration.
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

export default ({}) => (
  <UseCases>
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
  </UseCases>
)

const UseCases = styled.section`
  padding-top: 80px;
  padding-bottom: 57px;
`

const Container = styled.div`
  ${container};
`

const FlexWrap = styled.div`
  display: flex;
  justify-content: space-between;

  ${media.tablet`
    flex-direction: column;
  `};

  ${media.phablet`
    flex-direction: column-reverse;
  `};
`

const Video = styled.div`
  display: flex;
  flex: 1 2 60%;
  flex-direction: column;
  width: 100%;
  align-self: center;
  margin-right: 10%;

  ${media.tablet`
    margin-bottom: 20px;
    margin-right: 0;
    flex: auto;
  `};

  ${media.phablet`
    margin: 0;
  `};
`

const Right = styled.div`
  flex: 1 1 40%;

  ${media.tablet`
    flex: auto;
  `};

  ${media.phablet`
    flex: auto;
  `};
`

const Heading = styled.div`
  font-family: BrandonGrotesqueMed;
  min-height: 50px;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #40364d;

  ${media.tablet`
    text-align: left;
  `};
`

const Cases = styled.div`
  margin-top: 15px;
`

const Case = styled.div`
  margin-bottom: 18px;
`

const Top = styled.div`
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Icon = styled.div`
  margin-right: 8px;
`

const Title = styled.h3`
  font-family: BrandonGrotesqueMed;
  font-size: 16px;
  font-weight: 500;
  color: #40364d;
`

const Description = styled.div`
  padding-top: 15px;
  font-size: 16px;
  color: #5f6c72;
`
