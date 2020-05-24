const { parentResolverPassthrough } = require('gatsby-plugin-parent-resolvers')

module.exports = {
  html: {
    type: 'String!',
    resolve: parentResolverPassthrough()
  },
  htmlAst: {
    type: 'JSON!',
    resolve: parentResolverPassthrough()
  },
  timeToRead: {
    type: 'String!',
    resolve: parentResolverPassthrough()
  },
  template: 'String'
}
