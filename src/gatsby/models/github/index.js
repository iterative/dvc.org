/*
   GitHub Static Data

   This model serves as an intermediary between the templates and
   gatsby-plugin-github-api. If no GITHUB_TOKEN is specified, this node will be
   filled with default dummy data instead of throwing like using the plugin
   alone does.
*/

async function createStaticGithubDataNode(api, fieldData = {}) {
  const {
    actions: { createNode },
    createNodeId,
    createContentDigest
  } = api

  const fields = {
    stars: 8888,
    parent: null,
    ...fieldData
  }

  const node = {
    id: createNodeId('DVCGithubStaticData'),
    children: [],
    ...fields,
    internal: {
      type: 'StaticGithubData',
      contentDigest: createContentDigest(fields)
    }
  }

  await createNode(node)

  return node
}

module.exports = {
  sourceNodes: createStaticGithubDataNode,
  async onCreateNode(api) {
    const {
      node,
      actions: { createParentChildLink }
    } = api
    if (node.internal.type !== 'GithubData') return
    const child = await createStaticGithubDataNode(api, {
      parent: node.id,
      stars: node.rawResult.data.repository.stargazers.totalCount
    })
    await createParentChildLink({ child, parent: node })
  }
}
