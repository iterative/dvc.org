import PageContent from '../PageContent'
import SubscribeSection from '../SubscribeSection'

import Contribute from './Contribute'
import Events from './Events'
import Hero from './Hero'
import Learn from './Learn'
import Meet from './Meet'
import * as styles from './styles.module.css'
import Testimonial from './Testimonial'

const themes = {
  green: { backgroundColor: '#C2E6EE', color: '#13ADC7' },
  orange: { backgroundColor: '#EFD8D1', color: '#F46737' },
  purple: { backgroundColor: '#DCD6F1', color: '#955DD6' }
}

export interface ICommunitySectionTheme {
  backgroundColor: string
  color: string
}

const Community: React.FC = () => {
  return (
    <>
      <PageContent className={styles.content}>
        <Hero />
        <Meet theme={themes.purple} />
        <Testimonial theme={themes.purple} />
        <Contribute theme={themes.orange} />
        <Learn theme={themes.green} />
        <Events theme={themes.purple} />
      </PageContent>
      <SubscribeSection />
    </>
  )
}

export default Community
