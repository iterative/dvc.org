import styled from 'styled-components'

import { column, columns, container, media } from '../../../styles'

export const Diagram = styled.section`
  padding-top: 80px;
  padding-bottom: 91px;
`

export const Container = styled.div`
  ${container};
`

export const Title = styled.div`
  font-family: BrandonGrotesque;
  max-width: 550px;
  min-height: 44px;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #40364d;
  margin: 0px auto;
`

export const Abstract = styled.div`
  margin: 0px auto;
  padding-top: 10px;
  max-width: 590px;
  min-height: 50px;
  font-size: 16px;
  text-align: center;
  color: #5f6c72;
  line-height: 1.5;
`

export const Graphic = styled.section`
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

export const Columns = styled.div`
  ${columns};
  margin-top: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  ${media.tablet`flex-direction: column;`};
`

export const Column = styled.div`
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

export const Caption = styled.h3`
  font-family: BrandonGrotesque;
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 500;
  color: ${props => props.text};
`

export const Description = styled.div`
  max-width: ${props => (props.fullWidth ? '100%' : '311px')};
  font-size: 16px;
  color: #5f6c72;

  p {
    margin-bottom: 24px;

    ${media.tablet`
      margin-bottom: 12px;
    `};
  }
`

export const LearnMoreArea = styled.div`
  font-family: BrandonGrotesque;
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
    color: #945dd6;
  }

  a:hover {
    color: #745cb7;
  }

  a:visited {
    color: #945dd6;
  }

  a:visited:hover {
    color: #745cb7;
  }
`

export const SliderWrapper = styled.div`
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
    opacity: 0.35;
    color: #40364d;
  }

  img {
    pointer-events: none;
  }
`

export const Slide = styled.div`
  width: 100%;
  img {
    padding-top: 20px;
    padding-bottom: 20px;
    width: 100%;
    max-width: 380px;
    margin: 0 auto;
  }
`

export const SliderDots = styled.ul`
  margin-bottom: -20px;

  li button::before {
    font-size: 8px;
  }
`
