import React from 'react'

import HeroSection from '../HeroSection'
import FeaturesHero from './FeaturesHero'
import TrySection from '../TrySection'

import { Container, Description, Feature, Features, Icon, Name } from './styles'

export default function FeaturesPage() {
  return (
    <>
      <HeroSection>
        <FeaturesHero />
      </HeroSection>
      <Container>
        <Features>
          <Feature>
            <Icon>
              <img
                src="/img/features/icons/git-icon.svg"
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
                src="/img/features/icons/storage-icon.svg"
                alt="Storage agnostic"
              />
            </Icon>
            <Name>Storage agnostic</Name>
            <Description>
              Use Amazon S3, Microsoft Azure Blob Storage, Google Drive, Google
              Cloud Storage, Aliyun OSS, SSH/SFTP, HDFS, HTTP, network-attached
              storage, or disc to store data. The list of supported remote
              storage is constantly expanding.
            </Description>
          </Feature>
          <Feature>
            <Icon>
              <img src="/img/features/icons/repro.svg" alt="Reproducibility" />
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
                src="/img/features/icons/branching.svg"
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
              <img src="/img/features/icons/storage-icon.svg" alt="" />
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
                src="/img/features/icons/ml-pipe.svg"
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
                src="/img/features/icons/languages-icon.svg"
                alt="Language & framework agnostic"
              />
            </Icon>
            <Name>Language- & framework-agnostic</Name>
            <Description>
              No matter which programming language or libraries are in use or
              how code is structured, reproducibility and pipelines are based on
              input and output files or directories. Python, R, Julia, Scala
              Spark, custom binary, Notebooks, flatfiles/TensorFlow, PyTorch,
              etc. are all supported.
            </Description>
          </Feature>
          <Feature>
            <Icon>
              <img
                src="/img/features/icons/cluster.svg"
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
                src="/img/features/icons/failures.svg"
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
    </>
  )
}
