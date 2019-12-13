import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

import CommunitySection from '../Section'

import { Wrapper } from './styles'

import data from '../data'

const { color, description, icon, title } = data.section.learn
const { documentation, userContent } = data

export default function CommunityLearn({ posts }) {
  return (
    <CommunitySection
      color={color}
      description={description}
      icon={icon}
      title={title}
    >
      <Wrapper>
        <div>
          <div>Documentation</div>
          {documentation.map(({ url, title, description }) => (
            <div key={url}>
              <a href={url}>{title}</a>
              <div>{description}</div>
            </div>
          ))}
          <a href="/">See all docs</a>
        </div>
        <div>
          <div>DVC Blog</div>
          {posts.map(({ url, title, date, comments }) => (
            <div key={url}>
              <a href={url}>{title}</a>
              <div>{comments} comments</div>
              <div>{format(date, 'MMMM, d')}</div>
            </div>
          ))}
          <a href="https://blog.dvc.org">See all Posts</a>
        </div>
        <div>
          <div>User Content</div>
          {userContent.map(({ url, title, author, date }) => (
            <div key={url}>
              <a href={url}>{title}</a>
              <div>{author}</div>
              <div>{new Date(date).toString()}</div>
            </div>
          ))}
        </div>
      </Wrapper>
    </CommunitySection>
  )
}

CommunityLearn.propTypes = {
  posts: PropTypes.array
}
