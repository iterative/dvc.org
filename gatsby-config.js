/* eslint-env node */

const path = require('path')

require('./config/prismjs/dvc')
require('./config/prismjs/usage')

const apiMiddleware = require('./middleware/api')
const redirectsMiddleware = require('./middleware/redirects')

const title = 'Data Version Control · DVC'
const description =
  'Open-source version control system for Data Science and Machine Learning ' +
  'projects. Git-like experience to organize your data, models, and ' +
  'experiments.'

const keywords = [
  'data version control',
  'machine learning',
  'models management'
]

const plugins = [
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'blog',
      path: path.join(__dirname, 'content', 'docs')
    }
  },
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        'gatsby-remark-dvc-linker',
        'gatsby-remark-prismjs',
        'gatsby-remark-copy-linked-files',
        'gatsby-remark-smartypants',
        {
          resolve: 'gatsby-remark-external-links'
        },
        {
          resolve: 'gatsby-remark-autolink-headers',
          options: {
            enableCustomId: true,
            isIconAfterHeader: true
          }
        }
      ]
    }
  },
  'gatsby-plugin-catch-links',
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      background_color: '#eff4f8',
      display: 'minimal-ui',
      icon: 'static/favicon-512x512.png',
      name: 'dvc.org',
      short_name: 'dvc.org',
      start_url: '/',
      theme_color: '#eff4f8'
    }
  },
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-styled-components',
  'gatsby-plugin-sitemap',
  {
    resolve: 'gatsby-plugin-sentry',
    options: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      enabled: process.env.NODE_ENV === 'production'
    }
  }
]

if (process.env.CONTEXT === 'production') {
  plugins.push({
    options: {
      respectDNT: true,
      trackingId: process.env.GA_ID
    },
    resolve: 'gatsby-plugin-google-analytics'
  })
}

module.exports = {
  plugins,
  siteMetadata: {
    description,
    keywords,
    siteUrl: 'https://dvc.org',
    title
  },
  developMiddleware: app => {
    app.use(redirectsMiddleware)
    app.use('/api', apiMiddleware)
  }
}
