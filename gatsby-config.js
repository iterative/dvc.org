/* eslint-env node */

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
  /*{
    options: {
      background_color: '#eff4f8',
      display: 'minimal-ui',
      //icon: 'static/512.png',
      name: 'dvc.org',
      short_name: 'dvc.org',
      start_url: '/',
      theme_color: '#eff4f8'
    },
    resolve: 'gatsby-plugin-manifest'
  },*/
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
  }
}
