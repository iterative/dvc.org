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
      require.resolve('./src/templates/doc.tsx')
    ),
    remark: Joi.boolean().default(true)
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

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        [path.resolve(__dirname, 'sidebar')]: require.resolve('./src/sidebar'),
        [path.resolve(__dirname, 'redirects')]:
          require.resolve('./src/redirects')
      }
    }
  })
}

exports.createPages = require('./createPages.js')

exports.onCreateNode = require('./onCreateNode.js')
