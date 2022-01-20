require('dotenv').config()

const path = require('path')
// const { copyFile, mkdir, stat } = require('fs/promises')
const Jimp = require('jimp')

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

// const checkIfDirExists = async folderPath => {
//   try {
//     await stat(folderPath)
//     return true
//   } catch (err) {
//     if (err.code === 'ENOENT') {
//       return false
//     }
//   }
// }

// const mkDirIfItDoesNotExist = async folderPath => {
//   const doesDirExist = await checkIfDirExists(folderPath)
//   if (!doesDirExist) {
//     return mkdir(folderPath)
//   }
// }

// exports.onPostBuild = async ({ graphql }) => {
//   try {
//     const {
//       data: {
//         allBlogPost: { nodes }
//       }
//     } = await graphql(`
//       query GetBlogMainImages {
//         allBlogPost {
//           nodes {
//             picture {
//               gatsbyImageData(width: 850)
//             }
//             date
//           }
//         }
//       }
//     `)

//     await mkDirIfItDoesNotExist('./public/blog/images')

//     await Promise.all(
//       nodes.map(async node => {
//         const date = node.date.slice(0, 10)

//         return mkDirIfItDoesNotExist(`./public/blog/images/${date}`)
//       })
//     )

//     await Promise.all(
//       nodes.map(async node => {
//         const imagePath = node.picture.gatsbyImageData.images.fallback.src
//         const date = node.date.slice(0, 10)
//         return copyFile(
//           path.join(__dirname, 'public', imagePath),
//           path.join(
//             __dirname,
//             '/public/blog/images',
//             date,
//             path.basename(imagePath)
//           )
//         )
//       })
//     )
//   } catch (err) {
//     console.error(err)
//   }
// }

exports.onPostBuild = async ({ graphql }) => {
  try {
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
        return Jimp.read(path.join(__dirname, 'static', 'uploads', imagePath))
          .then(lenna => {
            return lenna
              .resize(850, Jimp.AUTO)
              .write(path.join(__dirname, 'public', 'blog', imagePath))
          })
          .catch(err => {
            console.error(err)
          })
      })
    )
  } catch (err) {
    console.error(err)
  }
}
