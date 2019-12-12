import React from 'react'
import styled from 'styled-components'

import Head from 'next/head'

import { container } from '../src/styles'
import { media } from '../src/styles'

import Page from '../src/Page'
import Hero from '../src/Hero'
import FeaturesHero from '../src/FeaturesHero'
import TrySection from '../src/TrySection'
import { META_BASE_TITLE } from '../src/consts'

const HeadInjector = () => (
  <Head>
    <title>Features | {META_BASE_TITLE}</title>
  </Head>
)

export default function FeaturesPage() {
  return (
    <Page stickHeader={true}>
      <HeadInjector />
      <Hero>
        <FeaturesHero />
      </Hero>
      <Container>
        <Features>
          <Feature>
            <Icon>
              <img
                src="/static/img/features/icons/git-icon.svg"
                alt="Git compatible"
              />
            </Icon>
            <Name>Git-compatible</Name>
            <Description>
              DVC runs on top of any Git repository and is compatible with any
              standard Git server or provider (GitHub, GitLab, etc). Data file
              contents can be shared by network-accessible storage or any
              supported cloud solution. DVC offers all the advantages of a
              distributed version control system — lock-free, local branching,
              and versioning.
            </Description>
          </Feature>
          <Feature>
            <Icon>
              <img
                src="/static/img/features/icons/storage-icon.svg"
                alt="Storage agnostic"
              />
            </Icon>
            <Name>Storage agnostic</Name>
            <Description>
              Use Amazon S3, Microsoft Azure Blob Storage, Google Drive, Google
              Cloud Storage, Aliyun OSS, SSH/SFTP, HDFS, HTTP, network-attached
              storage, or rsync to store data. The list of supported remote
              storage is constantly expanding.
            </Description>
          </Feature>
          <Feature>
            <Icon>
              <img
                src="/static/img/features/icons/repro.svg"
                alt="Reproducibility"
              />
            </Icon>
            <Name>Reproducible</Name>
            <Description>
              The single &#39;dvc repro&#39; command reproduces experiments
              end-to-end. DVC guarantees reproducibility by consistently
              maintaining a combination of input data, configuration, and the
              code that was initially used to run an experiment.
            </Description>
          </Feature>
          <Feature>
            <Icon>
              <img
                src="/static/img/features/icons/branching.svg"
                alt="Low-friction branching"
              />
            </Icon>
            <Name>Low friction branching</Name>
            <Description>
              DVC fully supports instantaneous Git branching, even with large
              files. Branches beautifully reflect the non-linear structure and
              highly iterative nature of a ML process. Data is not duplicated —
              one file version can belong to dozens of experiments. Create as
              many experiments as you want, instantaneously switch back and
              forth, and save a history of all attempts.
            </Description>
          </Feature>
          <Feature>
            <Icon>
              <img src="/static/img/features/icons/storage-icon.svg" alt="" />
            </Icon>
            <Name>Metric tracking</Name>
            <Description>
              Metrics are first-class citizens in DVC. DVC includes a command to
              list all branches, along with metric values, to track the progress
              or pick the best version.
            </Description>
          </Feature>
          <Feature>
            <Icon>
              <img
                src="/static/img/features/icons/ml-pipe.svg"
                alt="ML pipelines framework"
              />
            </Icon>
            <Name>ML pipeline framework</Name>
            <Description>
              DVC has a built-in way to connect ML steps into a DAG and run the
              full pipeline end-to-end. DVC handles caching of intermediate
              results and does not run a step again if input data or code are
              the same.
            </Description>
          </Feature>
          <Feature>
            <Icon>
              <img
                src="/static/img/features/icons/languages-icon.svg"
                alt="Language & framework agnostic"
              />
            </Icon>
            <Name>Language- & framework-agnostic</Name>
            <Description>
              No matter which programming language or libraries are in use or
              how code is structured, reproducibility and pipelines are based on
              input and output files. Python, R, Julia, Scala Spark, custom
              binary, Notebooks, flatfiles/TensorFlow, PyTorch, etc. are all
              supported.
            </Description>
          </Feature>
          <Feature>
            <Icon>
              <img
                src="/static/img/features/icons/cluster.svg"
                alt="HDFS, Hive & Apache Spark"
              />
            </Icon>
            <Name>HDFS, Hive & Apache Spark</Name>
            <Description>
              Include Spark and Hive jobs in the DVC data versioning cycle along
              with local ML modeling steps or manage Spark and Hive jobs with
              DVC end-to-end. Drastically decrease a feedback loop by
              decomposing a heavy cluster job into smaller DVC pipeline steps.
              Iterate on the steps independently with respect to dependencies.
            </Description>
          </Feature>
          <Feature>
            <Icon>
              <img
                src="/static/img/features/icons/failures.svg"
                alt="Failure tracking"
              />
            </Icon>
            <Name>Track failures</Name>
            <Description>
              Bad ideas can sometimes spark more ideas among colleagues than
              successful ones. Retaining knowledge of failed attempts can save
              time in the future. DVC is built to track everything in a
              reproducible and easily accessible way.
            </Description>
          </Feature>
        </Features>
      </Container>
      <TrySection title="Ready to give it a try?" />
    </Page>
  )
}

const Container = styled.div`
  ${container};
`

const Features = styled.div`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  padding-top: 110px;
  padding-bottom: 90px;

  ${media.phablet`
    padding-top: 70px;
    padding-bottom: 50px;
  `};
`

const Feature = styled.div`
  flex: 33.3%;
  flex-basis: 311px;
  margin-bottom: 63px;
`

const Icon = styled.div`
  height: 48px;

  img {
    width: 48px;
    height: 48px;
  }
`

const Name = styled.h3`
  font-family: BrandonGrotesqueMed;
  margin-top: 10px;
  margin-bottom: 10px;

  font-size: 20px;
  font-weight: 500;
  color: #40364d;

  min-height: 28px;
`

const Description = styled.div`
  max-width: 311px;

  font-size: 16px;
  color: #5f6c72;
`
