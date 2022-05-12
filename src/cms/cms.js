import CMS from 'netlify-cms-app'
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
          { label: 'Date', name: 'date', widget: 'datetime' },
          { label: 'Description', name: 'description' },
          { label: 'Description Long', name: 'descriptionLong' },
          { label: 'Picture', name: 'picture', widget: 'image' },
          { label: 'Picture Comment', name: 'pictureComment' },
          { label: 'Author', name: 'author' },
          { label: 'Tags', name: 'tags', widget: 'list' },
          { label: 'Comments Url', name: 'commentsUrl' },
          { label: 'Body', name: 'body', widget: 'markdown' }
        ]
      }
    ]
  }
})
