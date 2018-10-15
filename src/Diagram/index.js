import React, { Component } from 'react'
import styled from 'styled-components'
import { media, container, columns, column, OnlyDesktop, OnlyMobile } from '../styles'
import { Element } from 'react-scroll'
import Slider from 'react-slick'

const LearnMore = ({ href }) => (
  <LearnMoreArea href={href}>
    <a href={href}>
      <span>Learn&nbsp;more</span>
      <img src="/static/img/learn_more_arrow.svg" width={18} height={18} />
    </a>
  </LearnMoreArea>
)

const ColumnOne = ({ fullWidth }) => (
  <Column>
    <Caption text={`#945dd6`}>ML project version control</Caption>
    <Description fullWidth>
      <p>
        Version control machine learning models, data sets and
        intermediate files. DVC connects them with code and uses
        S3, Azure, GCP, SSH or to store file contents.
      </p>
      <p>
        Full code and data provenance help track the complete evolution of
        every ML model. This guarantees reproducibility and makes it
        easy to switch back and forth between experiments.
      </p>
    </Description>
    <LearnMore href={'/features'} />
  </Column>
)

const ColumnTwo = ({ fullWidth }) => (
  <Column>
    <Caption text={`#13adc7`}>ML experiment management</Caption>
    <Description fullWidth>
      <p>
        Harness the full power of Git branches to try different ideas
        instead of sloppy file suffixes and comments in code. Use
        automatic metric-tracking to navigate instead of paper and pencil.
      </p>
      <p>
        DVC was designed to keep branching as simple and fast as in Git —
        no matter the data file size. Along with first-class citizen
        metrics and ML pipelines, it means that a project has cleaner
        structure. It&#39;s easy to compare ideas and pick the best.
        Iterations become faster with intermediate artifact caching.
      </p>
    </Description>
    <LearnMore href={'/features'} />
  </Column>
)

const ColumnThree = ({ fullWidth }) => (
  <Column>
    <Caption text={`#f46837`}>Deployment & Collaboration</Caption>
    <Description fullWidth>
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
    <LearnMore href={'/features'} />
  </Column>
)

export class DiagramSection extends Component {

  render() {
    const imagesSliderProps = {
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: 1,
      infinite: true,
      speed: 600,
      buttons: true,
      dots: true,
      appendDots: dots => <SliderDots>{dots}</SliderDots>,
    };

    return (
      <Diagram>
        <Element name="diagram-section" />
        <Container>
          <Title>DVC tracks ML models and data sets</Title>
          <Abstract>
            DVC is built to make ML models shareable and reproducible.
            It is designed to handle large files, data sets, machine
            learning models, and metrics as well as code.
          </Abstract>
    
          <OnlyDesktop>
            <Graphic>
              <img src="/static/img/graphic.png" />
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
                  <img src="/static/img/experiments.png" alt="ML project version control" />
                  <ColumnOne fullWidth />
                </Slide>
                <Slide>
                  <img src="/static/img/graph.png" alt="ML experiment management" />
                  <ColumnTwo fullWidth />
                </Slide>
                <Slide>
                  <img src="/static/img/result.png" alt="Deployment & Collaboration" />
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

export default DiagramSection;

const Diagram = styled.section`
  padding-top: 80px;
  padding-bottom: 91px;
`

const Container = styled.div`
  ${container};
`

const Title = styled.div`
  font-family: BrandonGrotesqueMed;
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
  padding-top: 10px;
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
    width: 100%;
    max-width: 900px;
    max-height: 445px;
  }

  ${media.phablet`
    overflow-x: scroll;
    overflow-y: hidden;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    overflow-x: scroll;
    overflow-y: hidden;
  }
`

const Columns = styled.div`
  ${columns};
  margin-top: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  ${media.tablet`flex-direction: column;`};
`

const Column = styled.div`
  ${column};
  max-width: 33.3%;
  display: block;
  margin-top: 49px;
  padding: 0 10px;
  box-sizing: border-box;

  ${media.tablet`
    margin-right: 0px;
    flex-basis: auto;
    max-width: 100%;
  `};

  ${media.phablet`
    margin-top: 20px;
    flex-basis: auto;
    max-width: 100%;
  `};
`

const Caption = styled.h3`
  font-family: BrandonGrotesqueMed;
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 500;
  color: ${props => props.text};
`

const Description = styled.div`
  max-width: ${(props) => props.fullWidth ? '100%' : '311px'};
  font-size: 16px;
  color: #5f6c72;

  p {
    margin-bottom: 24px;

    ${media.tablet`
      margin-bottom: 12px;
    `};
  }
`

const LearnMoreArea = styled.div`
  font-family: BrandonGrotesqueMed;
  line-height: 28px;
  font-size: 20px;
  font-weight: 500;
  color: #945dd6;

  img {
    margin-left: 19px;
    margin-top: 3px;
  }

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #945dd6
  }
  
  a:hover {
    color: #745CB7;
  }
  
  a:visited {
    color: #945dd6;
  }
  
  a:visited:hover {
    color: #745CB7;
  }
`

const SliderWrapper = styled.div`
  .slick-next, 
  .slick-prev {
    height: 30px;
    width: 30px;
    z-index: 3;
  }

  .slick-next {
    right: -25px;
  }

  .slick-prev {
    left: -25px;
  }

  .slick-next:before, 
  .slick-prev:before {
    font-size: 30px;
    line-height: 1;
    opacity: .35;
    color: #40364d;
  }

  img {
    pointer-events: none;
  }
`;

const Slide = styled.div`
  width: 100%;
  img {
    padding-top: 20px;
    padding-bottom: 20px;
    width: 100%;
    max-width: 380px;
    margin: 0 auto;
  }
`;

const SliderDots = styled.ul`
  margin-bottom: -20px;

  li button::before {
    font-size: 8px;
  }
`;
