/* eslint-env node */

require('dotenv').config()
const path = require('path')

require('./config/prismjs/dvc')
require('./config/prismjs/usage')
require('./config/prismjs/dvctable')

const customYoutubeTransformer = require('./config/gatsby-remark-embedder/custom-yt-embedder')
const apiMiddleware = require('./src/server/middleware/api')
const redirectsMiddleware = require('./src/server/middleware/redirects')
const makeFeedHtml = require('./plugins/utils/makeFeedHtml')
const { BLOG } = require('./src/consts')
const { linkIcon } = require('./static/icons')

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
  'gatsby-plugin-postcss',
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-sitemap',
  'gatsby-plugin-twitter',
  {
    resolve: 'gatsby-theme-iterative-docs',
    options: {
      remark: false
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'content',
      path: path.join(__dirname, 'content')
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: path.join(__dirname, 'static', 'uploads')
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'img',
      path: path.join(__dirname, 'static')
    }
  },
  'gatsby-plugin-image',
  'community-page',
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        {
          resolve: 'gatsby-remark-embedder',
          options: {
            customTransformers: [customYoutubeTransformer]
          }
        },
        'gatsby-remark-dvc-linker',
        {
          resolve: 'gatsby-remark-args-linker',
          options: {
            icon: linkIcon,
            // Pathname can also be array of paths. eg: ['docs/command-reference;', 'docs/api']
            pathname: 'docs/command-reference'
          }
        },
        {
          resolve: 'gatsby-remark-prismjs',
          options: {
            noInlineHighlight: true,
            languageExtensions: [
              {
                language: 'text',
                definition: {}
              }
            ]
          }
        },
        {
          resolve: 'gatsby-remark-smartypants',
          options: {
            quotes: false
          }
        },
        {
          resolve: 'gatsby-remark-embed-gist',
          options: {
            includeDefaultCss: true
          }
        },
        'gatsby-remark-relative-images',
        'gatsby-remark-copy-linked-files',
        'gatsby-remark-external-links',
        {
          resolve: 'gatsby-remark-autolink-headers',
          options: {
            enableCustomId: true,
            isIconAfterHeader: true,
            icon: linkIcon
          }
        },
        {
          resolve: 'gatsby-remark-images',
          options: {
            maxWidth: BLOG.imageMaxWidth,
            withWebp: true,
            quality: 90,
            loading: 'auto'
          }
        },
        'gatsby-remark-responsive-iframe',
        'resize-image-plugin',
        'external-link-plugin'
      ]
    }
  },
  {
    resolve: 'gatsby-plugin-svgr',
    options: {
      ref: true
    }
  },
  'gatsby-transformer-sharp',
  {
    resolve: 'gatsby-plugin-sharp',
    options: {
      defaults: {
        placeholder: 'blurred'
      }
    }
  },
  {
    resolve: 'gatsby-plugin-catch-links',
    options: {
      excludePattern: /\/doc\/cml/
    }
  },
  {
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: process.env.GATSBY_ALGOLIA_APP_ID || 'B87HVF62EF',
      apiKey: process.env.ALGOLIA_ADMIN_KEY,
      skipIndexing:
        process.env.CI && process.env.ALGOLIA_ADMIN_KEY ? false : true,
      queries: require('./src/utils/algolia-queries.js'),
      enablePartialUpdates:
        process.env.ALGOLIA_FULL_UPDATE === true ? false : true,
      matchFields: ['slug', 'modified']
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
  },
  {
    resolve: `gatsby-plugin-feed`,
    options: {
      feeds: [
        {
          description,
          output: '/blog/rss.xml',
          query: `
            {
              allBlogPost(
                sort: { fields: [date], order: DESC }
              ) {
                nodes {
                  htmlAst
                  slug
                  title
                  date
                  description
                }
              }
            }
          `,
          serialize: ({ query: { site, allBlogPost } }) => {
            return allBlogPost.nodes.map(node => {
              const html = makeFeedHtml(node.htmlAst, site.siteMetadata.siteUrl)
              return Object.assign(
                {},
                {
                  /* eslint-disable-next-line @typescript-eslint/naming-convention */
                  custom_elements: [{ 'content:encoded': html }],
                  title: node.title,
                  date: node.date,
                  description: node.description,
                  guid: site.siteMetadata.siteUrl + node.slug,
                  url: site.siteMetadata.siteUrl + node.slug
                }
              )
            })
          },
          title
        }
      ],
      query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
    `
    }
  },
  {
    resolve: 'gatsby-plugin-sentry',
    options: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.SOURCE_VERSION,
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

if (process.env.ANALYZE) {
  plugins.push({
    resolve: 'gatsby-plugin-webpack-bundle-analyser-v2'
  })
}

module.exports = {
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
