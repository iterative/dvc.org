https://redirector.googlevideo.com/videoplayback?expire=1586853957&ei=JVyVXv3xGJfjkgbV0qOQBQ&ip=104.223.33.41&id=a260613bb3f6d9b2&itag=37&source=picasa&begin=0&requiressl=yes&mh=Du&mm=30&mn=sn-a5mlrnel&ms=nxu&mv=u&mvi=2&pl=17&sc=yes&ttl=transient&susc=ph&app=fife&mime=video/mp4&cnr=14&dur=1434.273&lmt=1586782374367924&mt=1586846464&sparams=expire,ei,ip,id,itag,source,requiressl,ttl,susc,app,mime,cnr,dur,lmt&sig=AJpPlLswRQIgfdQ5lyTw4MaUyYzL6sU5p9kKwtYJ1jocgr87QjZ7RwQCIQDZ2qd3BdfsqDO1itbNBlV0x8XtO2khf3Hc1YEqOcqhpA==&lsparams=mh,mm,mn,ms,mv,mvi,pl,sc&lsig=ALrAebAwRQIgIrELVT4JW3z2TWN4nOW9rJ9Ck1ZH5jTyuCvf7xLeBhICIQDFt3xVEWMsw8kVHx3SuDlhkRg3cyL5UL2hmcA9mYziig==&jparams=MTA0LjE5Mi4xMzAuMTkz&upx=TW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0OyBydjo3NS4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94Lzc1LjA=#betaHost&tr=2/* eslint-env node */

const path = require('path')

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
  {
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
                    html
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
              return Object.assign({}, node.frontmatter, {
                /* eslint-disable-next-line @typescript-eslint/camelcase */
                custom_elements: [{ 'content:encoded': node.html }],
                date: node.date,
                description: node.description,
                guid: site.siteMetadata.siteUrl + node.slug,
                url: site.siteMetadata.siteUrl + node.slug
              })
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
