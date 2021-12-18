module.exports = {
  createSchemaCustomization: async function createSchemaCustomization(api) {
    const {
      actions: { createTypes },
      schema: { buildObjectType }
    } = api
    createTypes([
      buildObjectType({
        name: 'DocsPage',
        interfaces: ['Node'],
        fields: {
          template: 'String',
          title: 'String',
          description: 'String'
        }
      })
    ])
  },
  createPages: require('./createPages.js'),
  onCreateNode: require('./onCreateNode.js')
}
