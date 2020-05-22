const callOnModels = require('../../utils/models')
const yaml = require('js-yaml')

async function parseContentToJson({ node, loadNodeContent }) {
  switch (node.extension) {
    case 'json':
      return JSON.parse(await loadNodeContent(node))

    case 'yml':
    case 'yaml':
      return yaml.safeLoad(await loadNodeContent(node))

    default:
      return null
  }
}

module.exports = {
  async onCreateNode(api, { models }) {
    const { node } = api
    if (node.internal.type !== 'File') return null
    const content = await parseContentToJson(api)

    if (!content) return null
    return callOnModels(models, 'onParseDataFile', api, {
      content
    })
  }
}
