import React from 'react'
import PropTypes from 'prop-types'

import Page from '../Page'
import Subscribe from '../Subscribe'

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

export default function Community({ issues, posts, topics }) {
  return (
    <Page stickHeader={true}>
      <PageWrapper>
        <CommunityHero />
        <CommunityMeet issues={issues} topics={topics} theme={themes.purple} />
        <CommunityContribute theme={themes.orange} />
        <CommunityLearn posts={posts} theme={themes.green} />
        <CommunityEvents theme={themes.purple} />
        <Subscribe />
      </PageWrapper>
    </Page>
  )
}

Community.propTypes = {
  issues: PropTypes.array,
  posts: PropTypes.array,
  topics: PropTypes.array
}
