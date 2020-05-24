const callOnModels = require('../../utils/models')
const { childNodeCreator } = require('../../utils/models/nodes.js')

module.exports = {
  async onCreateNode(api, { models }) {
    const { node, loadNodeContent } = api
    const createChildNode = childNodeCreator(api)
    if (node.internal.type !== 'File' || node.extension !== 'json') return null

    const content = JSON.parse(await loadNodeContent(node))

    return callOnModels(models, 'onParseJsonFile', api, {
      content,
      createChildNode
    })
  }
}
