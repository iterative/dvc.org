const {
  getNodeSlug,
  setPageContext,
  removePageTrailingSlash
} = require('./src/gatsby/common')
const { createPages: createDocPages } = require('./src/gatsby/doc')
const { createPages: createBlogPages } = require('./src/gatsby/blog')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    createNodeField({
      name: 'slug',
      node,
      value: getNodeSlug(node, getNode)
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  createDocPages({ graphql, actions })
  createBlogPages({ graphql, actions })
}

exports.onCreatePage = ({ page, actions }) => {
  setPageContext(page, actions)
  removePageTrailingSlash(page, actions)
}

// Ignore warnings about CSS inclusion order, because we use CSS modules.
// https://spectrum.chat/gatsby-js/general/having-issue-related-to-chunk-commons-mini-css-extract-plugin~0ee9c456-a37e-472a-a1a0-cc36f8ae6033?m=MTU3MjYyNDQ5OTAyNQ==
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === 'build-javascript') {
    const config = getConfig()

    // Add polyfills
    config.entry.app = [
      'promise-polyfill/src/polyfill',
      'isomorphic-fetch',
      config.entry.app
    ]

    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    )
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true
    }
    actions.replaceWebpackConfig(config)
  }
}
