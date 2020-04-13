const buildApi = require('../../../utils/models')

/*
  Markdown Content model.
  A sort of "parent model" that implements its own API, a light wrapper around
  "onCreateNode" only called with markdown nodes from the File source named "content"
*/

/** MarkdownContentAPI
   {
     models: Array<ModelDefinition>
       The received models passed through for if a child transformer wants to use them.
     parentNode: Object<GatsbyNode>
       The current node's parent node (almost certainly a File), since we already have it.
   }
 */

/** ContentTransformer
   (api: Object<GatsbyAPI>, options: Object<GatsbyOptions>, markdownContentApi: Object<MarkdownContentApi>)
 */

const api = {
  async onCreateNode(api, options, { models }) {
    const { node, getNode } = api
    // Only operate on nodes from the file instance named "content".
    if (node.internal.type === 'MarkdownRemark') {
      const parentNode = getNode(node.parent)
      const { sourceInstanceName } = parentNode
      if (sourceInstanceName === 'content') {
        return buildApi(models, { models, parentNode })(
          'onCreateMarkdownContentNode'
        )(api, options)
      }
    }
    // Return null in any other situation.
    return null
  }
}

module.exports = api
