require('dotenv').config()
global.__basedir = __dirname

const { setPageContext } = require('./src/gatsby/common')

const models = require('./src/gatsby/models.js')
const callOnModels = require('./src/gatsby/utils/models')

exports.createSchemaCustomization = api =>
  callOnModels(models, 'createSchemaCustomization', api)
exports.sourceNodes = api => callOnModels(models, 'sourceNodes', api)
exports.onCreateNode = api => callOnModels(models, 'onCreateNode', api)
exports.createPages = api => callOnModels(models, 'createPages', api)
exports.createResolvers = api => callOnModels(models, 'createResolvers', api)
exports.onPostBuild = api => callOnModels(models, 'onPostBuild', api)

exports.onCreatePage = ({ page, actions }) => {
  setPageContext(page, actions)
}
