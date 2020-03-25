import React from 'react'
import Page from '../Page'

export default function PageWrapper({ element, props }) {
  return <Page {...props}>{element}</Page>
}
