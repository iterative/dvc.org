/* eslint-env node */

const { select, selectAll } = require('hast-util-select')

const path = require('path')
const rehype = require('rehype')
const urls = require('rehype-urls')

require('./config/prismjs/dvc')
require('./config/prismjs/usage')

const apiMiddleware = require('./src/server/middleware/api')
const redirectsMiddleware = require('./src/server/middleware/redirects')
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

const feedPlugin = {
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
          /* This processor works on Rehype ASTs, doing two things:

          1: All root-relative links are prepended with the site URL, making
             them absolute. This uses data from siteMetadata, hence why it is
             defined within this scope.

          2: All images processed by Gatsby to be responsive are "unwrapped"
             into their fallback 'img' nodes, as RSS doesn't work with the
             tricks that true HTML does.
           */
          const processor = rehype()
            .use(urls, url =>
              url.href.startsWith('/')
                ? site.siteMetadata.site_url + url.href
                : undefined
            )
            .use(() => tree => {
              // Unwrap all gatsby-resp-image-wrapper elements into plain images.
              selectAll('.gatsby-resp-image-wrapper', tree).forEach(node => {
                const fallbackImg = select('img', node)
                delete node.children
                Object.assign(node, fallbackImg)
                node.properties = {
                  ...node.properties,
                  style: 'max-width: 100%'
                }
              })
              return tree
            })
            .freeze()

          return allBlogPost.nodes.map(node => {
            const html = processor.stringify(processor.runSync(node.htmlAst))
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
  },
  resolve: `gatsby-plugin-feed`
}

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
    options: {
      name: 'images',
      path: path.join(__dirname, 'static', 'uploads')
    },
    resolve: 'gatsby-source-filesystem'
  },
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        'gatsby-remark-embedder',
        'gatsby-remark-dvc-linker',
        {
          options: {
            noInlineHighlight: true
          },
          resolve: 'gatsby-remark-prismjs'
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
        {
          resolve: 'gatsby-remark-external-links'
        },
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
      ref: true
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
  feedPlugin,
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
