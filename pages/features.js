import React, { Component } from 'react'
import styled from 'styled-components'

import { container } from '../src/styles'

import Page from '../src/Page'
import Hero from '../src/Hero'
import FeaturesHero from '../src/FeaturesHero'
import TrySection from '../src/TrySection'

export default () => (
  <Page stickHeader={true}>
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
          <Name>Git compatible</Name>
          <Description>
            DVC runs on top of any Git repository and is compatible with any
            standard Git server or provider (Github, Gitlab, etc), while data
            files contents can be shared by one of the supported cloud or
            network storages. All advantages of a distributed version control
            system - lock-free, local branching and versioning.
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
            Use S3, GCP, SSH, SFTP, rsync or any network attached storage to
            store data files content. The list of supported protocols is
            expanding.
          </Description>
        </Feature>
        <Feature>
          <Icon>
            <img
              src="/static/img/features/icons/repro.svg"
              alt="Reproducibility"
            />
          </Icon>
          <Name>Reproducibility </Name>
          <Description>
            A single command ‘dvc repro’ reproduces an experiment end-to-end.
            DVC guarantees reproducibility by keeping consistently a combination
            of input data files, configuration and code that was initially used
            to run an experiment
          </Description>
        </Feature>
        <Feature>
          <Icon>
            <img
              src="/static/img/features/icons/branching.svg"
              alt="Low friction branching"
            />
          </Icon>
          <Name>Low friction branching </Name>
          <Description>
            DVC fully supports instantaneous Git branching even with large data
            files. Branches beautifully reflect the non-linear structure, highly
            iterative nature of a ML process. No data duplication - one file
            version can belong to dozens of experiments. Create as many
            experiments as you want, instantaneously switch back and forth, save
            history of all attempts.
          </Description>
        </Feature>
        <Feature>
          <Icon>
            <img src="/static/img/features/icons/storage-icon.svg" alt="" />
          </Icon>
          <Name>Metrics tracking</Name>
          <Description>
            Metrics are first class citizen in DVC. DVC includes a command to
            list all branches along with metric values to track the progress or
            pick the best version.
          </Description>
        </Feature>
        <Feature>
          <Icon>
            <img
              src="/static/img/features/icons/ml-pipe.svg"
              alt="ML Pipelines framework"
            />
          </Icon>
          <Name>ML Pipelines framework</Name>
          <Description>
            DVC has a built-in way to connect ML steps into a DAG and run the
            full pipeline end-to-end. DVC handles caching of intermediate
            results and does not run a step again if input data or code are the
            same.
          </Description>
        </Feature>
        <Feature>
          <Icon>
            <img
              src="/static/img/features/icons/languages-icon.svg"
              alt="Language & framework agnostic"
            />
          </Icon>
          <Name>Language & framework agnostic</Name>
          <Description>
            Python, R, Julia, Scala Spark, custom binary/ Notebooks or flat
            files/TensorFlow, PyTorch, etc. No matter which programming language
            or library are in use or how code is structured, reproducibility and
            pipelines are based on input and output files.
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
            Include Spark and Hive jobs into DVC data versioning cycle along
            with local ML modeling steps or manage Spark and Hive jobs with DVC
            end-to-end. Drastically decrease a feedback loop by decomposing a
            heavy cluster job into smaller DVC pipeline steps. Iterate on the
            steps independently with respect to dependencies.
          </Description>
        </Feature>
        <Feature>
          <Icon>
            <img
              src="/static/img/features/icons/failures.svg"
              alt="Track failures"
            />
          </Icon>
          <Name>Track failures</Name>
          <Description>
            Some bad ideas can bring more information to colleagues then some of
            the successful ones. Keeping knowledge of failed attempts can save
            time in the future. DVC is built to track everything in a
            reproducible, easily accessible way.
          </Description>
        </Feature>
      </Features>
    </Container>
    <TrySection />
  </Page>
)

const Container = styled.div`
  ${container};
`

const Features = styled.div`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  padding-top: 110px;
  padding-bottom: 110px;
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
