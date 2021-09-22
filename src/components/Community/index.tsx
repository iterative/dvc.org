import React from 'react'

import PageContent from '../PageContent'

import SubscribeSection from '../SubscribeSection'
import Hero from './Hero'
import Meet from './Meet'
import Contribute from './Contribute'
import Learn from './Learn'
import Events from './Events'

import styles from './styles.module.css'

const themes = {
  green: { backgroundColor: '#C2E6EE', color: '#13ADC7' },
  orange: { backgroundColor: '#EFD8D1', color: '#F46737' },
  purple: { backgroundColor: '#DCD6F1', color: '#955DD6' }
}

export interface ICommunitySectionTheme {
  backgroundColor: string
  color: string
}

const Community: React.FC = () => (
  <>
    <PageContent className={styles.content}>
      <Hero />
      <Meet theme={themes.purple} />
      <Contribute theme={themes.orange} />
      <Learn theme={themes.green} />
      <Events theme={themes.purple} />
    </PageContent>
    <SubscribeSection />
  </>
)

export default Community
