import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

import CommunityBlock from '../Block'
import CommunityButton from '../Button'
import CommunitySection from '../Section'

import { Comments, Item, Items, Line, Link, Meta, Wrapper } from './styles'

import data from '../data'

const { description, icon, title } = data.section.learn
const { documentation, userContent } = data

export default function CommunityLearn({ posts, theme }) {
  return (
    <Wrapper>
      <CommunitySection
        color={theme.color}
        description={description}
        icon={icon}
        title={title}
      >
        <Items>
          <Item>
            <CommunityBlock
              title="Documentation"
              action={
                <CommunityButton theme={theme} href="/">
                  See all docs
                </CommunityButton>
              }
            >
              {documentation.map(({ url, title, description }) => (
                <Line key={url}>
                  <Link color={theme.color} large href={url}>
                    {title}
                  </Link>
                  <Meta>{description}</Meta>
                </Line>
              ))}
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="DVC Blog"
              action={
                <CommunityButton theme={theme} href="https://blog.dvc.org">
                  See all Posts
                </CommunityButton>
              }
            >
              {posts.map(({ url, title, date, comments }) => (
                <Line key={url}>
                  <Link color={theme.color} href={url}>
                    {title}
                  </Link>
                  <Meta>
                    <Comments href={url}>{comments} comments</Comments>{' '}
                    {format(date, 'MMMM, d')}
                  </Meta>
                </Line>
              ))}
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock title="User Content">
              {userContent.map(({ url, title, author, date }) => (
                <Line key={url}>
                  <Link color={theme.color} href={url}>
                    {title}
                  </Link>
                  <Meta>
                    {author} • {format(date, 'MMMM, d')}
                  </Meta>
                </Line>
              ))}
            </CommunityBlock>
          </Item>
        </Items>
      </CommunitySection>
    </Wrapper>
  )
}

CommunityLearn.propTypes = {
  posts: PropTypes.array,
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string
  })
}
