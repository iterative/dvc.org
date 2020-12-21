/* eslint-env node */

require('dotenv').config()
const path = require('path')

require('./config/prismjs/dvc')
require('./config/prismjs/usage')

const apiMiddleware = require('./src/server/middleware/api')
const redirectsMiddleware = require('./src/server/middleware/redirects')
const makeFeedHtml = require('./plugins/utils/makeFeedHtml')
const { BLOG } = require('./src/consts')

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
  'community-page',
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        'gatsby-remark-embedder',
        'gatsby-remark-dvc-linker',
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
            isIconAfterHeader: true
          }
        },
        {
          resolve: 'gatsby-remark-images',
          options: {
            maxWidth: BLOG.imageMaxWidth,
            withWebp: true
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
      ref: true,
      svgoConfig: {
        plugins: [{ removeViewBox: false }]
      }
    }
  },
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
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
                  /* eslint-disable-next-line @typescript-eslint/camelcase */
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

if (process.env.GITHUB_TOKEN) {
  plugins.push({
    resolve: `gatsby-source-github-api`,
    options: {
      // token: required by the GitHub API
      token: process.env.GITHUB_TOKEN,

      // GraphQLquery: defaults to a search query
      graphQLQuery: `
          {
            repository(owner: "iterative", name: "dvc") {
              stargazers {
                totalCount
              }
            }
          }
        `,
      variables: {}
    }
  })
}

if (process.env.CONTEXT === 'production') {
  plugins.push({
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      respectDNT: true,
      trackingId: process.env.GA_ID
    }
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
