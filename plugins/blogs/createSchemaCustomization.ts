import { GatsbyNode } from 'gatsby'
import { parentResolverPassthrough } from 'gatsby-plugin-parent-resolvers'

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] =
  async api => {
    const {
      actions: { createTypes },
      schema: { buildObjectType }
    } = api

    const typeDefs = [
      buildObjectType({
        name: `BlogPost`,
        interfaces: [`Node`],
        extensions: {
          infer: false
        },
        fields: {
          htmlAst: {
            type: 'JSON!',
            resolve: parentResolverPassthrough()
          },
          commentsUrl: `String`,
          date: { type: `Date`, extensions: { dateformat: {} } },
          description: `String`,
          descriptionLong: {
            type: `String`,
            extensions: { md: {} }
          },
          pictureComment: {
            type: `String`,
            extensions: { md: {} }
          },
          slug: `String`,
          sourcePath: `String`,
          tags: `[String]`,
          title: `String`,
          author: {
            type: `Author`,
            extensions: {
              link: { by: `filename` }
            }
          },
          contributors: {
            type: `[Author]`,
            extensions: {
              link: { by: `filename` }
            }
          },
          picture: {
            type: `File`,
            resolve: (source, _args, context) =>
              context.nodeModel.findOne({
                type: `File`,
                query: {
                  filter: {
                    sourceInstanceName: { eq: `uploads-images` },
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
