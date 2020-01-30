import React from 'react'
import PropTypes from 'prop-types'
import Error from 'next/error'
import Head from 'next/head'
import fetch from 'isomorphic-fetch'

import Documentation from '../src/components/Documentation'

import { getItemByPath } from '../src/utils/sidebar'

import { META_BASE_TITLE } from '../src/consts'

export default function DocumentationPage({ item, markdown, errorCode }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return (
    <>
      <Head>
        <title>
          {item.label} | {META_BASE_TITLE}
        </title>
      </Head>
      <Documentation markdown={markdown} {...item} />
    </>
  )
}

DocumentationPage.propTypes = {
  item: PropTypes.object,
  markdown: PropTypes.string,
  errorCode: PropTypes.number
}

DocumentationPage.getInitialProps = async ({ asPath, req }) => {
  const item = getItemByPath(asPath.split(/[?#]/)[0])

  if (!item) {
    return {
      errorCode: 404
    }
  }

  const host = req ? req.headers['host'] : window.location.host
  const protocol = host.indexOf('localhost') > -1 ? 'http:' : 'https:'

  try {
    const res = await fetch(`${protocol}//${host}${item.source}`)

    if (res.status !== 200) {
      return {
        errorCode: res.status
      }
    }

    const markdown = await res.text()

    return {
      item,
      markdown
    }
  } catch {
    console.error(`Can't fetch ${protocol}//${host}${item.source}`)
    window.location.reload()
  }
}
