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
    resolve: `gatsby-plugin-typescript`,
    options: {
      isTSX: true,
      allExtensions: true
    }
  },
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
        {
          resolve: 'gatsby-remark-smartypants',
          options: {
            quotes: false
          }
        },
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
      /* eslint-disable @typescript-eslint/camelcase */
      background_color: '#eff4f8',
      display: 'minimal-ui',
      icon: 'static/favicon-512x512.png',
      name: 'dvc.org',
      short_name: 'dvc.org',
      start_url: '/',
      theme_color: '#eff4f8'
      /* eslint-enable @typescript-eslint/camelcase */
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
      release: process.env.CIRCLE_SHA1,
      enabled: process.env.NODE_ENV === 'production',
      ignoreErrors: [
        /* When we deploy new version we delete assets which were generated for
        the previous deployed version, but users can have opened old version in 
        their browsers. If they hover some link on the page Gatsby.js will try
        fetch old chunks and will get ChunkLoadError, but then will load static
        page from the new deployed version and all will be ok. So we can just
        ignore these type of errors */
        'ChunkLoadError'
      ],
      /* There are some common urls which recomment to ignore. It's even 
      mentioned in the official documentation: https://docs.sentry.io/platforms/javascript/#decluttering-sentry
      In our case we just ignore all errors from the browser's extensions,
      because we can't influence on then somehow. */
      blacklistUrls: [/extensions\//i, /^chrome:\/\//i]
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

if (process.env.ANALYZE) {
  plugins.push({
    resolve: 'gatsby-plugin-webpack-bundle-analyzer',
    options: {
      analyzerPort: 4000,
      production: process.env.NODE_ENV === 'production'
    }
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
