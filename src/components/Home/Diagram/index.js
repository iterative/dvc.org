/* eslint jsx-a11y/anchor-is-valid: off */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Element } from 'react-scroll'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Link from '../../Link'

import { OnlyDesktop, OnlyMobile } from '../../../styles'

import {
  Abstract,
  Caption,
  Column,
  Columns,
  Container,
  Description,
  Diagram,
  Graphic,
  LearnMoreArea,
  Slide,
  SliderDots,
  SliderWrapper,
  Title
} from './styles'

const LearnMore = ({ href }) => (
  <LearnMoreArea>
    <Link href={href}>
      <span>Learn&nbsp;more</span>
      <img src="/img/learn_more_arrow.svg" width={18} height={18} alt="" />
    </Link>
  </LearnMoreArea>
)

LearnMore.propTypes = {
  href: PropTypes.string.isRequired
}

const ColumnOne = () => (
  <Column>
    <Caption text={`#945dd6`}>ML project version control</Caption>
    <Description fullWidth>
      <p>
        Version control machine learning models, data sets and intermediate
        files. DVC connects them with code, and uses Amazon S3, Microsoft Azure
        Blob Storage, Google Drive, Google Cloud Storage, Aliyun OSS, SSH/SFTP,
        HDFS, HTTP, network-attached storage, or disc to store file contents.
      </p>
      <p>
        Full code and data provenance help track the complete evolution of every
        ML model. This guarantees reproducibility and makes it easy to switch
        back and forth between experiments.
      </p>
    </Description>
    <LearnMore href={'/features'} />
  </Column>
)

const ColumnTwo = () => (
  <Column>
    <Caption text={`#13adc7`}>ML experiment management</Caption>
    <Description fullWidth>
      <p>
        Harness the full power of Git branches to try different ideas instead of
        sloppy file suffixes and comments in code. Use automatic metric-tracking
        to navigate instead of paper and pencil.
      </p>
      <p>
        DVC was designed to keep branching as simple and fast as in Git — no
        matter the data file size. Along with first-class citizen metrics and ML
        pipelines, it means that a project has cleaner structure. It&#39;s easy
        to compare ideas and pick the best. Iterations become faster with
        intermediate artifact caching.
      </p>
    </Description>
    <LearnMore href={'/features'} />
  </Column>
)

const ColumnThree = () => (
  <Column>
    <Caption text={`#f46837`}>Deployment & Collaboration</Caption>
    <Description fullWidth>
      <p>
        Instead of ad-hoc scripts, use push/pull commands to move consistent
        bundles of ML models, data, and code into production, remote machines,
        or a colleague&#39;s computer.
      </p>
      <p>
        DVC introduces lightweight pipelines as a first-class citizen mechanism
        in Git. They are language-agnostic and connect multiple steps into a
        DAG. These pipelines are used to remove friction from getting code into
        production.
      </p>
    </Description>
    <LearnMore href={'/features'} />
  </Column>
)

export default class DiagramSection extends Component {
  render() {
    const imagesSliderProps = {
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: 1,
      infinite: true,
      speed: 600,
      buttons: true,
      dots: true,
      appendDots: dots => <SliderDots>{dots}</SliderDots>
    }

    return (
      <Diagram>
        <Element name="diagram-section" />
        <Container>
          <Title>DVC tracks ML models and data sets</Title>
          <Abstract>
            DVC is built to make ML models shareable and reproducible. It is
            designed to handle large files, data sets, machine learning models,
            and metrics as well as code.
          </Abstract>

          <OnlyDesktop>
            <Graphic>
              <img src="/img/graphic.png" alt="" />
            </Graphic>
            <Columns>
              <ColumnOne />
              <ColumnTwo />
              <ColumnThree />
            </Columns>
          </OnlyDesktop>

          <OnlyMobile>
            <SliderWrapper>
              <Slider {...imagesSliderProps}>
                <Slide>
                  <img
                    src="/img/experiments.png"
                    alt="ML project version control"
                  />
                  <ColumnOne fullWidth />
                </Slide>
                <Slide>
                  <img src="/img/graph.png" alt="ML experiment management" />
                  <ColumnTwo fullWidth />
                </Slide>
                <Slide>
                  <img src="/img/result.png" alt="Deployment & Collaboration" />
                  <ColumnThree fullWidth />
                </Slide>
              </Slider>
            </SliderWrapper>
          </OnlyMobile>
        </Container>
      </Diagram>
    )
  }
}
