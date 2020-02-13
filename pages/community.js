import React from 'react'
import Head from 'next/head'

import {
  getLatestIssues,
  getLatestTopics,
  getLatestPosts
} from '../src/utils/api'

import Community from '../src/components/Community'

import { META_BASE_TITLE } from '../src/consts'

export default function CommunityPage(props) {
  return (
    <>
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
        <title>Community | {META_BASE_TITLE}</title>
      </Head>
      <Community {...props} />
    </>
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
