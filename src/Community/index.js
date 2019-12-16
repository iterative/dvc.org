import React from 'react'
import PropTypes from 'prop-types'

import CommunityContribute from './Contribute'
import CommunityEvents from './Events'
import CommunityHero from './Hero'
import CommunityLearn from './Learn'
import CommunityMeet from './Meet'

const themes = {
  green: { backgroundColor: '#C2E6EE', color: '#13ADC7' },
  orange: { backgroundColor: '#EFD8D1', color: '#F46737' },
  purple: { backgroundColor: '#DCD6F1', color: '#955DD6' }
}

export default function Community({ discord, issues, posts, topics }) {
  return (
    <>
      <CommunityHero />
      <CommunityMeet
        discord={discord}
        issues={issues}
        topics={topics}
        theme={themes.purple}
      />
      <CommunityContribute theme={themes.orange} />
      <CommunityLearn posts={posts} theme={themes.green} />
      <CommunityEvents theme={themes.purple} />
    </>
  )
}

Community.propTypes = {
  discord: PropTypes.shape({
    registered: PropTypes.number,
    messages_per_mont: PropTypes.number,
    online: PropTypes.number
  }),
  issues: PropTypes.array,
  posts: PropTypes.array,
  topics: PropTypes.array
}
