import { GatsbyNode } from 'gatsby'

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] =
  ({ actions: { createTypes }, schema: { buildObjectType } }) => {
    const typeDefs = [
      buildObjectType({
        name: `AuthorLink`,
        fields: {
          url: `String!`,
          site: `String`,
          username: `String`
        }
      }),
      buildObjectType({
        name: `AuthorPosts`,
        fields: {
          totalCount: `Int!`,
          nodes: `[BlogPost]`
        }
      }),
      buildObjectType({
        name: `Author`,
        interfaces: [`Node`],
        fields: {
          name: `String`,
          links: `[AuthorLink]`,
          slug: `String`,
          avatar: {
            type: `File`,
            resolve: (source, _args, context) =>
              context.nodeModel.findOne({
                query: {
                  filter: {
                    sourceInstanceName: { eq: `authors-avatars` },
                    relativePath: {
                      eq: source.avatar
                    }
                  }
                },
                type: `File`
              })
          },
          posts: {
            type: `AuthorPosts`,
            args: {
              limit: {
                type: `Int`
              }
            },
            async resolve(source, args, context) {
              const query = await context.nodeModel.findAll({
                query: {
                  filter: {
                    author: {
                      sourcePath: {
                        relativePath: {
                          eq: source.sourcePath
                        }
                      }
                    }
                  },
                  sort: {
                    fields: [`date`],
                    order: [`DESC`]
                  }
                },
                type: `BlogPost`
              })

              return {
                totalCount: await query.totalCount(),
                nodes: query.entries.slice(0, args.limit)
              }
            }
          }
        }
      })
    ]
    createTypes(typeDefs)
  }
