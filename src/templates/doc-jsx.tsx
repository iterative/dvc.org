import { PropsWithChildren } from 'react'

import Documentation from '@dvcorg/gatsby-theme-iterative/src/components/Documentation/Layout'
import SEO from '@dvcorg/gatsby-theme-iterative/src/components/SEO'
import { getItemByPath } from '@dvcorg/gatsby-theme-iterative/src/utils/shared/sidebar'

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
