import { ReactNode } from 'react'

import Typography from '@/components/Typography'

const BlogHeader = ({
  title,
  description
}: {
  title?: string
  description?: ReactNode
}) => {
  return (
    <div className="mt-2">
      {title && <Typography variant="h1">{title}</Typography>}
      {description && <Typography variant="subtitle">{description}</Typography>}
    </div>
  )
}

export default BlogHeader
