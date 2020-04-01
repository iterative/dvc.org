import React from 'react'

import SubscribeSection from '../SubscribeSection'

import CommunityContribute from './Contribute'
import CommunityEvents from './Events'
import CommunityHero from './Hero'
import CommunityLearn from './Learn'
import CommunityMeet from './Meet'

import { PageWrapper } from './styles'

const themes = {
  green: { backgroundColor: '#C2E6EE', color: '#13ADC7' },
  orange: { backgroundColor: '#EFD8D1', color: '#F46737' },
  purple: { backgroundColor: '#DCD6F1', color: '#955DD6' }
}

export default function Community() {
  return (
    <>
      <PageWrapper>
        <CommunityHero />
        <CommunityMeet theme={themes.purple} />
        <CommunityContribute theme={themes.orange} />
        <CommunityLearn theme={themes.green} />
        <CommunityEvents theme={themes.purple} />
        <SubscribeSection />
      </PageWrapper>
    </>
  )
}
