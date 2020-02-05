import React from 'react'
import PropTypes from 'prop-types'
import fetch from 'isomorphic-fetch'

import Error from 'next/error'
import Head from 'next/head'

import Documentation from '../src/components/Documentation'

import { getItemByPath } from '../src/utils/sidebar'
import { makeAbsoluteURL } from '../src/utils/api'

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

  try {
    const res = await fetch(makeAbsoluteURL(req, item.source))

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
    window.location.reload()
  }
}
