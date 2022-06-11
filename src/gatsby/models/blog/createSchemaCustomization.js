const markdownParentFields = require('../markdown-content/fields.js')
const { resolvePostAuthor } = require('../../utils/resolvers')

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
          type: 'File',
          resolve: (source, args, context) =>
            context.nodeModel.findOne({
              type: 'File',
              query: {
                filter: {
                  sourceInstanceName: { eq: 'images' },
                  relativePath: { eq: source.picture }
                }
              }
            })
        }
      }
    })
  ]
  createTypes(typeDefs)
}

module.exports = createSchemaCustomization
