/* eslint-env node */

require('dotenv').config()
const path = require('path')

const apiMiddleware = require('@dvcorg/websites-server/src/middleware/api')
const redirectsMiddleware = require('@dvcorg/websites-server/src/middleware/redirects')

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
    resolve: '@dvcorg/gatsby-theme-iterative',
    options: {
      simpleLinkerTerms: require('./content/linked-terms'),
      glossaryPath: path.resolve('content', 'basic-concepts')
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'data',
      path: path.join(__dirname, 'content', 'data')
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: path.join(__dirname, 'static', 'img')
    }
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `authors`,
      path: path.join(__dirname, `content`, `authors`)
    }
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `blogs`,
      path: path.join(__dirname, `content`, `blogs`)
    }
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `authors-avatars`,
      path: path.join(__dirname, `content`, `uploads`, `avatars`)
    }
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `uploads-images`,
      path: path.join(__dirname, `content`, `uploads`, `images`)
    }
  },
  `gatsby-plugin-catch-links`,
  `gatsby-plugin-sharp`,
  'gatsby-plugin-twitter',
  `gatsby-transformer-remark-frontmatter`,
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      background_color: '#eff4f8',
      display: 'minimal-ui',
      icon: 'static/favicon-512x512.png',
      name: 'dvc.org',
      short_name: 'dvc.org',
      start_url: '/',
      theme_color: '#eff4f8',
      icons: [
        {
          src: '/apple-touch-icon-48x48.png',
          sizes: '48x48',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-256x256.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: '/apple-touch-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },
  // local plugins
  'landing-page',
  `authors`,
  `blogs`,
  'community-page'
]

if (process.env.GATSBY_GTM_ID) {
  plugins.push({
    resolve: `gatsby-plugin-google-tagmanager`,
    options: {
      id: process.env.GATSBY_GTM_ID,

      // Include GTM in development.
      //
      // Defaults to false meaning GTM will only be loaded in production.
      includeInDevelopment: process.env.GTM_INCLUDE_IN_DEV === `true`,

      // datalayer to be set before GTM is loaded
      // should be an object or a function that is executed in the browser
      //
      // Defaults to null
      defaultDataLayer: { platform: `gatsby` }
    }
  })
}

if (process.env.ANALYZE) {
  plugins.push({
    resolve: 'gatsby-plugin-webpack-bundle-analyser-v2'
  })
}

module.exports = {
  trailingSlash: 'never',
  plugins,
  siteMetadata: {
    siteName: 'DVC',
    twitterUsername: `DVCorg`,
    description,
    author: 'Iterative',
    keywords,
    siteUrl: process.env.HEROKU_APP_NAME
      ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com/`
      : 'https://dvc.org',
    title
  },
  developMiddleware: app => {
    app.use(redirectsMiddleware)
    app.use('/api', apiMiddleware)
  },
  jsxRuntime: 'automatic'
}
