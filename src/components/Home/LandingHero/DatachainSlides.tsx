import React from 'react'
import Slides, { ISlide } from './Slides'
import { graphql, useStaticQuery } from 'gatsby'

const DatachainSlides = () => {
  const {
    dvcxSlide: { slides }
  } = useStaticQuery(graphql`
    query {
      dvcxSlide {
        slides {
          title
          description
          terminal
        }
      }
    }
  `) as {
    dvcxSlide: {
      slides: ISlide[]
    }
  }

  return <Slides slides={slides} terminalSide="left" />
}

export default DatachainSlides
