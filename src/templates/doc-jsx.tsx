import React, { PropsWithChildren } from 'react'
import { getItemByPath } from '@dvcorg/gatsby-theme-iterative/src/utils/shared/sidebar'

import SEO from '@dvcorg/gatsby-theme-iterative/src/components/SEO'

import Documentation from '@dvcorg/gatsby-theme-iterative/src/components/Documentation/Layout'

interface IJSXDocPageProps {
  title?: string
  description?: string
  slug: string
}

const JSXDocPage: React.FC<PropsWithChildren<IJSXDocPageProps>> = ({
  title,
  description,
  children,
  slug
}) => {
  const { label } = getItemByPath(slug)
  return (
    <>
      <SEO title={title || label} description={description} />
      <Documentation currentPath={slug}>{children}</Documentation>
    </>
  )
}

export default JSXDocPage
