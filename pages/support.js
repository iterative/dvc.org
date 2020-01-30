import React from 'react'
import Head from 'next/head'

import Support from '../src/components/Support'

import { META_BASE_TITLE } from '../src/consts'

export default function SupportPage() {
  return (
    <>
      <Head>
        <title>Support | {META_BASE_TITLE}</title>
      </Head>
      <Support />
    </>
  )
}
