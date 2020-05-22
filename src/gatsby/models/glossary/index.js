const unified = require('unified')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')

const processTooltipMarkdown = async input =>
  unified()
    .use(markdown)
    .use(remark2rehype)
    .use(html)
    .process(input)
    .then(result => result.toString())

const processGlossary = async ({ desc, contents, ...rest }) => ({
  desc: await processTooltipMarkdown(desc),
  contents: contents
    ? await Promise.all(contents.map(processGlossary))
    : undefined,
  ...rest
})

module.exports = {
  createSchemaCustomization({
    actions: { createTypes },
    schema: { buildObjectType }
  }) {
    const typeDefs = [
      buildObjectType({
        name: 'DVCGlossary',
        interfaces: ['Node'],
        fields: {
          content: 'JSON'
        }
      })
    ]
    createTypes(typeDefs)
  },
  async onParseDataFile(
    { actions: { createNode, createParentChildLink }, node, createNodeId },
    { content }
  ) {
    if (node.relativePath !== 'docs/glossary.yml') return null
    const glossary = await processGlossary(content)
    const fields = {
      content: glossary
    }

    const glossaryNode = {
      ...fields,
      id: createNodeId(`DVC Glossary JSON`),
      parent: node.id,
      internal: {
        type: 'DVCGlossary',
        contentDigest: node.internal.contentDigest
      }
    }

    return Promise.all([
      createNode(glossaryNode),
      createParentChildLink({ parent: node, child: glossaryNode })
    ])
  }
}
