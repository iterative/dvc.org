import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'

import { META_BASE_TITLE } from '../consts'

export const HeadInjector = ({ sectionName = 'Documentation' }) => (
  <Head>
    <title>
      {sectionName} | {META_BASE_TITLE}
    </title>
  </Head>
)

HeadInjector.propTypes = {
  sectionName: PropTypes.string
}
