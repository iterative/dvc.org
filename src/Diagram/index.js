import React from 'react'
import styled from 'styled-components'
import { media, container, columns, column } from '../styles'

const LearnMore = () => (
  <LearnMoreArea>
    Learn more
    <img src="/static/img/learn_more_arrow.svg" width={10} height={18} />
  </LearnMoreArea>
)

export default ({}) => (
  <Diagram>
    <Container>
      <Title>DVC streamlines machine learning projects</Title>
      <Abstract>
        DVC is an open-source framework and distributed version control system
        for machine learning projects. DVS is designed to handle large files,
        models, and metrics as well as code.
      </Abstract>

      <Graphic>
        <img src="/static/img/graphic.png" />
      </Graphic>

      <Columns>
        <Column>
          <Caption text={`#945dd6`}>ML project version control</Caption>
          <Description>
            <p>
              Keep pointers in Git to large data input files, ML models, and
              intermediate data files along with the code. Use S3, GCP, or any
              network-accessible storage to store file contents.
            </p>
            <p>
              Full code and data provenance help track the complete evolution of
              every ML experiment. This guarantees reproducibility and makes it easy
              to switch back and forth between experiments.
            </p>
          </Description>
          <LearnMore />
        </Column>
        <Column>
          <Caption text={`#13adc7`}>ML experiment management</Caption>
          <Description>
            <p>
              Harness the full power of Git branches to try different ideas instead of
              sloppy file suffixes and comments in code. Use automatic metric-tracking to
              navigate instead of paper and pencil.
            </p>
            <p>
              DVC was designed to keep branching as simple and fast as in Git —
              no matter the data file size. Along with first-class citizen metrics
              and ML pipelines, it means that a project has cleaner structure.
              It&#39;s easy to compare ideas and pick the best. Iterations become
              faster with intermediate artifact caching.
            </p>
          </Description>
          <LearnMore />
        </Column>
        <Column>
          <Caption text={`#f46837`}>Deployment & Collaboration</Caption>
          <Description>
            <p>
              Instead of ad-hoc scripts, use push/pull commands to move
              consistent bundles of ML models, data, and code into production,
              remote machines, or a colleague&#39;s computer.
            </p>
            <p>
              DVC introduces lightweight pipelines as a first-class citizen
              mechanism in Git. They are language-agnostic and connect multiple
              steps into a DAG. These pipelines are used to remove friction from
              getting code into production.
            </p>
          </Description>
          <LearnMore />
        </Column>
      </Columns>
    </Container>
  </Diagram>
)

const Diagram = styled.section`
  padding-top: 80px;
  padding-bottom: 91px;
`

const Container = styled.div`
  ${container};
`

const Title = styled.div`
  max-width: 550px;
  min-height: 44px;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #40364d;
  margin: 0px auto;
`

const Abstract = styled.div`
  margin: 0px auto;
  max-width: 590px;
  min-height: 50px;
  font-size: 16px;
  text-align: center;
  color: #5f6c72;
  line-height: 1.5;
`

const Graphic = styled.section`
  width: 100%;
  margin-top: 49px;

  img {
    max-width: 1005px;
    max-height: 445px;
  }

  ${media.phablet`
    overflow-x: scroll;
    overflow-y: hidden;
  `};
`

const Columns = styled.div`
  ${columns};
  margin-top: 10px;
`

const Column = styled.div`
  ${column};
  margin-top: 49px;

  ${media.tablet`margin-right: 0px;`};
`

const Caption = styled.h3`
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 500;
  color: ${props => props.text};
`

const Description = styled.div`
  max-width: 311px;
  font-size: 16px;
  color: #5f6c72;

  p {
    margin-bottom: 24px;
  }
`

const LearnMoreArea = styled.a`
  display: flex;
  align-items: center;
  line-height: 28px;
  font-size: 20px;
  font-weight: 500;
  color: #945dd6;

  img {
    margin-left: 19px;
  }
`
