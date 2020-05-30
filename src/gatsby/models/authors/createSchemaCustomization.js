const markdownParentFields = require('../markdown-content/fields.js')
const { resolveAuthorAvatar } = require('../../utils/resolvers')

async function createAuthorSchemaCustomization(api) {
  const {
    actions: { createTypes },
    schema: { buildObjectType }
  } = api
  const typeDefs = [
    buildObjectType({
      name: 'AuthorLink',
      fields: {
        url: 'String!',
        site: 'String',
        username: 'String'
      }
    }),
    buildObjectType({
      name: 'AuthorPosts',
      fields: {
        totalCount: 'Int!',
        nodes: '[BlogPost]'
      }
    }),
    buildObjectType({
      name: 'Author',
      interfaces: ['Node'],
      fields: {
        ...markdownParentFields,
        links: '[AuthorLink]',
        slug: 'String',
        avatar: {
          type: 'ImageSharp',
          resolve: resolveAuthorAvatar
        },
        posts: {
          type: 'AuthorPosts',
          args: {
            limit: {
              type: 'Int'
            }
          },
          async resolve(source, args, context) {
            const query = await context.nodeModel.runQuery({
              query: {
                filter: {
                  author: {
                    sourcePath: {
                      eq: source.sourcePath
                    }
                  }
                },
                sort: {
                  fields: ['date'],
                  order: ['DESC']
                }
              },
              type: 'BlogPost'
            })

            const nodes = args.limit ? query.slice(0, args.limit) : query

            return {
              totalCount: query.length,
              nodes
            }
          }
        }
      }
    })
  ]
  createTypes(typeDefs)
}

module.exports = createAuthorSchemaCustomization
