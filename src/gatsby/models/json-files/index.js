const callOnModels = require('../../utils/models')

module.exports = {
  async onCreateNode(api, { models }) {
    const { node, loadNodeContent } = api
    if (node.internal.type !== 'File' || node.extension !== 'json') return null

    const content = JSON.parse(await loadNodeContent(node))

    return callOnModels(models, 'onParseJsonFile', api, {
      content
    })
  }
}
