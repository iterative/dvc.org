import React from 'react'
import styled from 'styled-components'
import { media, container } from '../styles'

import { default as YoutubeVideo } from '../Video'

export default ({}) => (
  <UseCases>
    <Container>
      <Video>
        <YoutubeVideo id={`4h6I9_xeYA4`} />
      </Video>
      <Right>
        <Heading>Use cases</Heading>
        <Cases>
          <Case>
            <Top>
              <Icon>
                <img src="/static/img/save-reprro.svg" width={30} height={30} />
              </Icon>
              <Title>Save and reproduce your experiments</Title>
            </Top>
            <Description>
              At any time, fetch the full context about any experiment you or your
              team has run. DVC guarantees that all files and metrics will
              be consistent and in the right place to reproduce the experiment or
              use it as a baseline for a new iteration.
            </Description>
          </Case>
          <Case>
            <Top>
              <Icon>
                <img src="/static/img/git-icon.svg" width={30} height={30} />
              </Icon>
              <Title>Version control data files</Title>
            </Top>
            <Description>
              DVC keeps metafiles in Git instead of Google Docs to describe and
              version control your data sets and models. DVC supports a
              variety of external storage types as a remote cache for large
              files.
            </Description>
          </Case>
          <Case>
            <Top>
              <Icon>
                <img src="/static/img/share.svg" width={30} height={31} />
              </Icon>
              <Title>Establish workflow for deployment & collaboration</Title>
            </Top>
            <Description>
              DVC defines rules and processes for working effectively and
              consistently as a team. It serves as a protocol for collaboration,
              sharing results, and getting and running a finished model in a
              production environment.
            </Description>
          </Case>
        </Cases>
      </Right>
    </Container>
  </UseCases>
)

const UseCases = styled.section`
  padding-top: 80px;
  padding-bottom: 57px;
`

const Container = styled.div`
  ${container};
  display: flex;
  justify-content: space-between;

  ${media.phablet`
    flex-direction: column;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    flex-direction: column;
  }
`

const Video = styled.div`
  flex-basis: 476px;
  padding-top: 107px;
  padding-right: 107px;

  ${media.phablet`
    padding-top: 0px;
    padding-right: 0px;
    flex-basis: auto;
    order: 2;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    padding-right: 0px;
    padding-top: 107px;
    flex-basis: auto;
    order: 2;
  }
`

const Right = styled.div`
  flex-basis: 373px;

  ${media.phablet`
    flex-basis: auto;
    order: 1;
  `};
`

const Heading = styled.div`
  min-height: 44px;
  font-size: 30px;
  font-weight: 500;
  color: #40364d;
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
  font-size: 16px;
  font-weight: 500;
  color: #40364d;
`

const Description = styled.div`
  padding-top: 15px;
  font-size: 16px;
  color: #5f6c72;
`
