const markdownParentFields = require('../markdown-content/fields.js')
const { resolveRelativeImage } = require('../../utils/resolvers')

async function createAuthorSchemaCustomization(api) {
  const {
    actions: { createTypes },
    schema: { buildObjectType }
  } = api
  const typeDefs = [
    buildObjectType({
      name: 'Author',
      interfaces: ['Node'],
      fields: {
        ...markdownParentFields,
        avatar: {
          type: 'ImageSharp',
          resolve: resolveRelativeImage()
        }
      }
    })
  ]
  createTypes(typeDefs)
}

module.exports = createAuthorSchemaCustomization
