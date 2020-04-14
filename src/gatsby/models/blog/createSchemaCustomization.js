const markdownParentFields = require('../markdown-content/fields.js')
const {
  resolveNodeFromRelativeFile,
  resolveRelativeImage
} = require('../../utils/resolvers')

async function createSchemaCustomization(api) {
  const {
    actions: { createTypes },
    schema: { buildObjectType }
  } = api
  const typeDefs = [
    buildObjectType({
      name: 'BlogPost',
      interfaces: ['Node'],
      fields: {
        ...markdownParentFields,
        author: {
          type: 'Author',
          resolve: resolveNodeFromRelativeFile('Author')
        },
        picture: {
          type: 'ImageSharp',
          resolve: resolveRelativeImage()
        }
      }
    })
  ]
  createTypes(typeDefs)
}

module.exports = createSchemaCustomization
