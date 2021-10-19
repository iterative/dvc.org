import React from 'react'
import LayoutWidthContainer from '../../LayoutWidthContainer'
import Section from '../Section'
import IframeResizer from 'iframe-resizer-react'

import * as sharedStyles from '../styles.module.css'
import { ICommunitySectionTheme } from '..'

const description = 'See what people have to say about DVC'

const Testimonial: React.FC<{ theme: ICommunitySectionTheme }> = ({
  theme
}) => {
  return (
    <LayoutWidthContainer className={sharedStyles.wrapper}>
      <Section
        anchor="testimonial"
        color={theme.color}
        contentVisible={false}
        description={description}
        icon="/img/community/meet.svg"
        mobileDescription={description}
        title="Testimonials"
      >
        <IframeResizer
          title="testimonialto"
          id="testimonialto-iterative-open-source-community-shout-outs-light"
          src="https://embed.testimonial.to/w/iterative-open-source-community-shout-outs?theme=light&card=base&loadMore=on&initialCount=20"
          frameBorder="0"
          width="100%"
          height="100%"
        ></IframeResizer>
      </Section>
    </LayoutWidthContainer>
  )
}

export default Testimonial
