import React from 'react'

import Head from 'next/head'

import Features from '../src/components/Features'

import { META_BASE_TITLE } from '../src/consts'

export default function FeaturesPage() {
  return (
    <>
      <Head>
        <title>Features | {META_BASE_TITLE}</title>
      </Head>
      <Features />
    </>
  )
}
