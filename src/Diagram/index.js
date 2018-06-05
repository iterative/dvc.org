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
        for machine learning projects — designed to handle large data files,
        model files and metrics along with code.
      </Abstract>

      <Graphic>
        <img src="/static/img/graphic.png" />
      </Graphic>

      <Columns>
        <Column>
          <Caption text={`#945dd6`}>ML project version control</Caption>
          <Description>
            <p>
              Keep in Git pointers to large data input files, ML models and
              intermediate data files along the code. Use S3, GCP or any network
              accessible storage to store files content.
            </p>
            <p>
              Full code and data provenance helps tracking complete evolution of
              every ML experiment, guarantees reproducibility and makes it easy
              to switch back and forth between experiments.
            </p>
          </Description>
          <LearnMore />
        </Column>
        <Column>
          <Caption text={`#13adc7`}>ML experiments management</Caption>
          <Description>
            <p>
              Full power of Git branches to try different ideas instead of
              sloppy file suffixes and comments in code. Auto metric tracking to
              navigate instead of paper and pencil.
            </p>
            <p>
              DVC was designed to keep branching as simple and fast as in Git,
              large data files or not. Along with first class citizen metrics
              and ML pipelines it means that project has a cleaner structure,
              it’s easy to compare ideas and pick the best. Iterations become
              faster with intermediate artifacts caching.
            </p>
          </Description>
          <LearnMore />
        </Column>
        <Column>
          <Caption text={`#f46837`}>Deployment & Collaboration</Caption>
          <Description>
            <p>
              Instead of ad-hoc scripts, use push/pull commands to move
              consistent bundle of ML model, data and code into production,
              remote machine or colleague's computer.
            </p>
            <p>
              DVC introduces lightweight pipelines as a first class citizen
              mechanism in Git. They are language agnostic and connect multiple
              steps into a DAG. These pipelines are used to remove friction from
              getting all the code into production.
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
