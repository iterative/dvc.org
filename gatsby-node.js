require('dotenv').config()

const { statSync } = require('fs')
const { readdir } = require('fs/promises')
const path = require('path')
const Jimp = require('jimp')

const { setPageContext } = require('./src/gatsby/common')

const models = require('./src/gatsby/models.js')
const callOnModels = require('./src/gatsby/utils/models')
const { isProduction } = require('./src/server/utils')

exports.onPreBootstrap = async () => {
  if (!isProduction) {
    return
  }

  const getDirectories = async path => {
    try {
      const files = await readdir(path)
      const directoryPaths = files.filter(file =>
        statSync(path + '/' + file).isDirectory()
      )
      return directoryPaths
    } catch (err) {
      console.error(err)
    }
  }

  const getFiles = async pathName => {
    try {
      const files = await readdir(pathName)
      const filePaths = files.filter(file =>
        statSync(pathName + '/' + file).isFile()
      )
      return filePaths.map(file => path.join(pathName, file))
    } catch (err) {
      console.error(err)
    }
  }

  const directories = await getDirectories('./static/uploads/images')
  const allImages = await Promise.all(
    directories.map(
      async dir => await getFiles(path.join('./static/uploads/images', dir))
    )
  )

  allImages.flat().forEach(imageName => {
    if (imageName.endsWith('png')) {
      Jimp.read(imageName)
        .then(lenna => {
          return lenna
            .resize(800, Jimp.AUTO)
            .write(imageName.replace('uploads', 'blog'))
        })
        .catch(err => {
          console.error(err)
        })
    }
  })
}

exports.createSchemaCustomization = api =>
  callOnModels(models, 'createSchemaCustomization', api)
exports.sourceNodes = api => callOnModels(models, 'sourceNodes', api)
exports.onCreateNode = api => callOnModels(models, 'onCreateNode', api)
exports.createPages = api => callOnModels(models, 'createPages', api)
exports.createResolvers = api => callOnModels(models, 'createResolvers', api)
exports.onPostBuild = api => callOnModels(models, 'onPostBuild', api)

exports.onCreatePage = ({ page, actions }) => {
  setPageContext(page, actions)
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
      'raf-polyfill',
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
