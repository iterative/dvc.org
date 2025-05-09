import { graphql, useStaticQuery } from 'gatsby'

import Slides, { ISlide } from './Slides'

const DvcSlides = () => {
  const {
    dvcSlide: { slides }
  } = useStaticQuery(graphql`
    query {
      dvcSlide {
        slides {
          title
          description
          terminal
        }
      }
    }
  `) as {
    dvcSlide: {
      slides: ISlide[]
    }
  }

  return <Slides slides={slides} />
}

export default DvcSlides
