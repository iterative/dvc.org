const path = require('path')

const defaultGetTemplate = (template, defaultTemplate) =>
  template
    ? require.resolve(path.resolve('src', 'templates', template + '.tsx'))
    : defaultTemplate

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    disable: Joi.boolean().default(Boolean(process.env.SKIP_DOCS)),
    getTemplate: Joi.function().default(() => defaultGetTemplate),
    defaultTemplate: Joi.string().default(
      path.resolve('src', 'templates', 'doc.tsx')
    )
  })
}

exports.createSchemaCustomization = async api => {
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
}

exports.createPages = require('./createPages.js')

exports.onCreateNode = require('./onCreateNode.js')
