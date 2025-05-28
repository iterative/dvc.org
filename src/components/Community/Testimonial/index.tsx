import IframeResizer from '@iframe-resizer/react'

import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'

import { ICommunitySectionTheme } from '..'
import Section from '../Section'
import * as sharedStyles from '../styles.module.css'

import * as styles from './styles.module.css'

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
        <div className={styles.iframeContainer}>
          <IframeResizer
            license="GPLv3"
            title="testimonialto"
            id="testimonialto-iterative-open-source-community-shout-outs-light"
            src="https://embed.testimonial.to/w/iterative-open-source-community-shout-outs?theme=light&card=small&loadMore=on&initialCount=20"
            width="100%"
            height="100%"
          ></IframeResizer>
        </div>
      </Section>
    </LayoutWidthContainer>
  )
}

export default Testimonial
