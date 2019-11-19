import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'

import { META_BASE_TITLE } from '../../consts'

export const HeadInjector = ({ sectionName = 'Documentation' }) => (
  <Head>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/docsearch.js@2.6.2/dist/cdn/docsearch.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.4.0/css/perfect-scrollbar.min.css"
    />
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/docsearch.js@2.6.2/dist/cdn/docsearch.min.js"
    />
    <title>
      {sectionName} | {META_BASE_TITLE}
    </title>
  </Head>
)

HeadInjector.propTypes = {
  sectionName: PropTypes.string
}
