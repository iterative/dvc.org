import React from 'react'
import Head from 'next/head'

import Community from '../src/components/Community'

import { META_BASE_TITLE } from '../src/consts'

export default function CommunityPage() {
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
      <Community />
    </>
  )
}
