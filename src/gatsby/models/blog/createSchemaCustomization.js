const markdownParentFields = require('../markdown-content/fields.js')
const {
  resolvePostAuthor,
  resolvePostPicture
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
          resolve: resolvePostAuthor
        },
        picture: {
          type: 'ImageSharp',
          resolve: resolvePostPicture
        }
      }
    })
  ]
  createTypes(typeDefs)
}

module.exports = createSchemaCustomization
