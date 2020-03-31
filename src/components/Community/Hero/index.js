import React from 'react'

import Link from '../../Link'

import { logEvent } from '../../../utils/ga'

import { OnlyDesktop, OnlyMobile } from '../../../styles'
import { Link as LinkSC, Picture, Wrapper } from './styles'

import data from '../data.json'

const logHero = () => logEvent('community', 'hero')

export default function CommunityHero() {
  if (!data.hero) return ''

  return (
    <Wrapper>
      <Link as={LinkSC} href={data.hero.url} target="_blank" onClick={logHero}>
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
