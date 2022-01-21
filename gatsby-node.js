require('dotenv').config()

const path = require('path')
const { mkdir, stat } = require('fs/promises')
const sharp = require('sharp')

const { setPageContext } = require('./src/gatsby/common')

const models = require('./src/gatsby/models.js')
const callOnModels = require('./src/gatsby/utils/models')

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

const checkIfDirExists = async folderPath => {
  try {
    await stat(folderPath)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }
  }
}

const mkDirIfItDoesNotExist = async folderPath => {
  const doesDirExist = await checkIfDirExists(folderPath)
  if (!doesDirExist) {
    await mkdir(folderPath, { recursive: true })
  }
}

exports.onPostBuild = async ({ graphql }) => {
  try {
    // const start = Date.now()
    const {
      data: {
        allBlogPost: { nodes }
      }
    } = await graphql(`
      query GetBlogMainImages {
        allBlogPost {
          nodes {
            picture {
              fields {
                sourcePath
              }
            }
            date
          }
        }
      }
    `)

    await Promise.all(
      nodes.map(async node => {
        const imagePath = node.picture.fields.sourcePath
        const dirPath = path.dirname(
          path.join(__dirname, 'public', 'blog', imagePath)
        )
        await mkDirIfItDoesNotExist(dirPath)
        return sharp(path.join(__dirname, 'static', 'uploads', imagePath))
          .resize({ width: 850 })
          .toFile(path.join(__dirname, 'public', 'blog', imagePath))
          .catch(err => {
            console.error(err)
          })
      })
    )
    // const end = Date.now()
    // console.log(`Execution time: ${end - start} ms`)
  } catch (err) {
    console.error(err)
  }
}
