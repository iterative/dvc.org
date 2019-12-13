import React from 'react'

import { Link, Picture, Wrapper } from './styles'

import data from '../data.json'

export default function CommunityHero() {
  if (!data.hero) return ''

  return (
    <Wrapper>
      <Link href={data.hero.url} target="_blank" rel="noopener noreferrer">
        <Picture src={data.hero.picture} alt="" />
      </Link>
    </Wrapper>
  )
}
