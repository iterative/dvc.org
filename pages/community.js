import React from 'react'
import Head from 'next/head'

import {
  getLatestIssues,
  getLatestTopics,
  getLatestPosts
} from '../src/utils/api'

import Community from '../src/components/Community'
import Page from '../src/components/Page'
import Subscribe from '../src/components/Subscribe'

import { META_BASE_TITLE } from '../src/consts'

const HeadInjector = () => (
  <Head>
    <link
      rel="stylesheet"
      type="text/css"
      charSet="UTF-8"
      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
    />
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
    />
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
