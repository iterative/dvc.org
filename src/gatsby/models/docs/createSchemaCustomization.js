const markdownParentFields = require('../markdown-content/fields.js')

async function createSchemaCustomization(api) {
  const {
    actions: { createTypes },
    schema: { buildObjectType }
  } = api
  const typeDefs = [
    buildObjectType({
      name: 'DocsPage',
      interfaces: ['Node'],
      fields: {
        ...markdownParentFields,
        template: 'String'
      }
    })
  ]
  createTypes(typeDefs)
}

module.exports = createSchemaCustomization
