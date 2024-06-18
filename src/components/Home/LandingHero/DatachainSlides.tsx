import Slides, { ISlide } from './Slides'
import { graphql, useStaticQuery } from 'gatsby'

const DatachainSlides = () => {
  const {
    datachainSlide: { slides }
  } = useStaticQuery(graphql`
    query {
      datachainSlide {
        slides {
          title
          description
          terminal
        }
      }
    }
  `) as {
    datachainSlide: {
      slides: ISlide[]
    }
  }

  return <Slides slides={slides} terminalSide="left" />
}

export default DatachainSlides
