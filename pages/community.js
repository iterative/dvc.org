import React from 'react'
import Head from 'next/head'

import {
  getLatestIssues,
  getLatestTopics,
  getLatestPosts
} from '../src/utils/api'

import Community from '../src/Community'
import Page from '../src/Page'
import Subscribe from '../src/Subscribe'

import { META_BASE_TITLE } from '../src/consts'

const HeadInjector = () => (
  <Head>
    <title>{META_BASE_TITLE}</title>
  </Head>
)

export default function CommunityPage(props) {
  return (
    <Page stickHeader={true}>
      <HeadInjector />
      <Community {...props} />
      <Subscribe />
    </Page>
  )
}

CommunityPage.getInitialProps = async ({ req }) => {
  const issues = await getLatestIssues(req)
  const posts = await getLatestPosts(req)
  const topics = await getLatestTopics(req)

  return {
    issues,
    posts,
    topics
  }
}
