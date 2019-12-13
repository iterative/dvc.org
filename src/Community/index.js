import React from 'react'
import PropTypes from 'prop-types'

import CommunityContribute from './Contribute'
import CommunityEvents from './Events'
import CommunityHero from './Hero'
import CommunityLearn from './Learn'
import CommunityMeet from './Meet'

export default function Community({ discord, issues, posts, topics }) {
  return (
    <>
      <CommunityHero />
      <CommunityMeet discord={discord} issues={issues} topics={topics} />
      <CommunityContribute />
      <CommunityLearn posts={posts} />
      <CommunityEvents />
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
