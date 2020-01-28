import React from 'react'

import { OnlyDesktop, OnlyMobile } from '../../styles'
import { Link, Picture, Wrapper } from './styles'

import data from '../data.json'

export default function CommunityHero() {
  if (!data.hero) return ''

  return (
    <Wrapper>
      <Link href={data.hero.url} target="_blank" rel="noopener noreferrer">
        <OnlyDesktop>
          <Picture src={data.hero.pictureDesktop} alt="" />
        </OnlyDesktop>
        <OnlyMobile>
          <Picture src={data.hero.pictureMobile} alt="" />
        </OnlyMobile>
      </Link>
    </Wrapper>
  )
}
