/* eslint-env node */

require('dotenv').config()
const path = require('path')

const apiMiddleware = require('./src/server/middleware/api')
const redirectsMiddleware = require('./src/server/middleware/redirects')

const autoprefixer = require('autoprefixer')
const customMedia = require('postcss-custom-media')
const customProperties = require('postcss-custom-properties')
const mixins = require('postcss-mixins')
const colorMod = require('postcss-color-mod-function')

const mixinsConfig = require('@dvcorg/gatsby-theme-iterative/config/postcss/mixins')

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
  'gatsby-plugin-twitter',
  {
    resolve: '@dvcorg/gatsby-theme-iterative',
    options: {
      remark: false,
      simpleLinkerTerms: require('./content/linked-terms'),
      cssBase: require.resolve(
        './src/@dvcorg/gatsby-theme-iterative/components/Page/base.css'
      ),
      postCssPlugins: [
        require('postcss-nested'),
        customMedia({
          importFrom: './src/styles/media.css'
        }),
        mixins(mixinsConfig),
        customProperties({
          importFrom: [
            './src/@dvcorg/gatsby-theme-iterative/components/Page/base.css'
          ],
          disableDeprecationNotice: true
        }),
        colorMod({
          importFrom: [
            './src/@dvcorg/gatsby-theme-iterative/components/Page/base.css'
          ]
        }),
        autoprefixer
      ]
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: path.join(__dirname, 'static', 'img')
    }
  },
  'community-page',
  {
    resolve: 'gatsby-plugin-catch-links'
  },
  {
    resolve: `gatsby-source-rss-feed`,
    options: {
      url: `https://iterative.ai/blog/rss.xml`,
      name: `IterativeBlog`
    }
  },
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      /* eslint-disable @typescript-eslint/naming-convention */
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
      /* eslint-enable @typescript-eslint/naming-convention */
    }
  }
]

if (process.env.ANALYZE) {
  plugins.push({
    resolve: 'gatsby-plugin-webpack-bundle-analyser-v2'
  })
}

module.exports = {
  trailingSlash: 'never',
  plugins,
  siteMetadata: {
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
  }
}
