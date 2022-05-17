import React from 'react'
import cn from 'classnames'

import 'reset-css'
import '../../components/Page/base.css'
import '../../components/Page/fonts/fonts.css'
import * as previewStyles from './styles.module.css'
import * as postStyles from '../../components/Blog/Post/styles.module.css'
import * as styles from '../../components/Blog/Post/Markdown/styles.module.css'

const BlogPreview = ({ data }) => (
  <article>
    <div className={postStyles.head}>
      <div className={postStyles.headContent}>
        <h1 className={postStyles.title}>{data.title}</h1>
        <div className={postStyles.description}>{data.date}</div>
        <div className={postStyles.description}>{data.description}</div>
        <div className={postStyles.description}>{data.descriptionLong}</div>
        <div className={postStyles.description}>Picture: {data.picture}</div>
        <div className={postStyles.description}>Author: {data.author}</div>
        {data.tags && Array.isArray(data.tags) && (
          <div className={postStyles.tags}>
            {data.tags.map(tag => (
              <a href={`#${tag}`} className={postStyles.tag} key={tag}>
                {tag}
              </a>
            ))}
          </div>
        )}
        <div className={postStyles.description}>
          Comments Url: {data.commentsUrl}
        </div>
      </div>
    </div>
    <div className={postStyles.content}>
      <section className={cn(styles.wrapper, previewStyles.preview)}>
        {data.html}
      </section>
    </div>
  </article>
)
export default BlogPreview
