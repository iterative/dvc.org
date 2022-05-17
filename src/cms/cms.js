import CMS from 'netlify-cms-app'
import React from 'react'

import BlogPreview from './BlogPreview'
import config from '../config'

CMS.init({
  config: {
    backend: {
      name: config.cms.name,
      repo: config.cms.repo,
      branch: config.cms.branch,
      base_url: config.cms.base_url,
      auth_endpoint: config.cms.auth_endpoint
    },
    load_config_file: false,
    media_folder: 'static/uploads/images',
    public_folder: '/uploads/images',

    publish_mode: 'editorial_workflow',

    collections: [
      {
        name: 'blog',
        label: 'Blog',
        folder: 'content/blog',
        create: true,
        slug: '{{year}}-{{month}}-{{day}}-{{slug}}',
        fields: [
          { label: 'Title', name: 'title', widget: 'string' },
          {
            label: 'Date',
            name: 'date',
            widget: 'datetime',
            date_format: 'YYYY-MM-DD',
            time_format: false
          },
          { label: 'Description', name: 'description' },
          {
            label: 'Description Long',
            name: 'descriptionLong',
            widget: 'markdown'
          },
          { label: 'Picture', name: 'picture', widget: 'image' },
          { label: 'Picture Comment', name: 'pictureComment', required: false },
          { label: 'Author', name: 'author' },
          { label: 'Tags', name: 'tags', widget: 'list' },
          { label: 'Comments Url', name: 'commentsUrl' },
          { label: 'Body', name: 'body', widget: 'markdown' }
        ]
      }
    ]
  }
})

const BlogPreviewTemplate = ({ entry, widgetFor }) => {
  const data = entry.getIn(['data']).toJS()
  const html = widgetFor('body')
  const descriptionLong = widgetFor('descriptionLong')
  data.descriptionLong = descriptionLong
  data.html = html

  return <BlogPreview data={data} />
}

CMS.registerPreviewTemplate('blog', BlogPreviewTemplate)
