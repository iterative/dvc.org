/* eslint-disable react/prop-types */

import React from 'react'
import Layout from '../Layout'

export default function PageWrapper({ element, props }) {
  return <Layout {...props}>{element}</Layout>
}
