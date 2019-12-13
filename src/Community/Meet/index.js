import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

import CommunitySection from '../Section'

import data from '../data'

const { color, description, icon, title } = data.section.meet

import { Wrapper } from './styles'

export default function CommunityMeet({ discord, issues, topics }) {
  return (
    <CommunitySection
      color={color}
      description={description}
      icon={icon}
      title={title}
    >
      <Wrapper>
        <div>
          <h3>Join the Dev Chat</h3>
          <div>{discord.registered} registered developers</div>
          <div>
            {discord.messages_per_month} messages posted over the past month
          </div>
          <div>{discord.online} users online</div>
          <a href="/">Open Chat</a>
        </div>
        <div>
          <h3>Ask a Question</h3>
          {topics.map(({ url, title, date, comments }) => (
            <div key={url}>
              <a href={url}>{title}</a>
              <div>{comments} comments</div>
              <div>{format(date, 'MMMM, d')}</div>
            </div>
          ))}
          <a href="/">Read All Topics</a>
        </div>
        <div>
          <h3>Post an Issue</h3>
          {issues.map(({ url, title, date, comments }) => (
            <div key={url}>
              <a href={url}>{title}</a>
              <div>{comments} comments</div>
              <div>{format(date, 'MMMM, d')}</div>
            </div>
          ))}
          <a href="/">Read All Issues</a>
        </div>
      </Wrapper>
    </CommunitySection>
  )
}

CommunityMeet.propTypes = {
  discord: PropTypes.object,
  issues: PropTypes.array,
  topics: PropTypes.array
}
