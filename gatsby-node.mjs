import 'dotenv/config'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

global.__basedir = dirname(fileURLToPath(import.meta.url))

import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'

import { setPageContext } from './src/gatsby/common.js'
import models from './src/gatsby/models.js'
import callOnModels from './src/gatsby/utils/models/index.js'

export const createSchemaCustomization = api =>
  callOnModels(models, 'createSchemaCustomization', api)
export const sourceNodes = api => callOnModels(models, 'sourceNodes', api)

export const onCreateNode = api => callOnModels(models, 'onCreateNode', api)
export const createPages = api => callOnModels(models, 'createPages', api)
export const createResolvers = api => callOnModels(models, 'createResolvers', api)
export const onPostBuild = api => callOnModels(models, 'onPostBuild', api)

export const onCreatePage = ({ page, actions }) => {
  setPageContext(page, actions)
}

// Ignore warnings about CSS inclusion order, because we use CSS modules.
// https://spectrum.chat/gatsby-js/general/having-issue-related-to-chunk-commons-mini-css-extract-plugin~0ee9c456-a37e-472a-a1a0-cc36f8ae6033?m=MTU3MjYyNDQ5OTAyNQ==
export const onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === 'build-javascript') {
    const config = getConfig()

    // Add polyfills
    config.entry.app = [
      'promise-polyfill/src/polyfill',
      'isomorphic-fetch',
      'raf-polyfill',
      ...[].concat(config.entry.app)
    ]

    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    )
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true
    }
    actions.replaceWebpackConfig(config)
  }
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()]
    }
  })
}
