const unified = require('unified')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')

const rawGlossary = require('../../../../content/docs/glossary')

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
  async sourceNodes({
    actions: { createNode },
    createNodeId,
    createContentDigest
  }) {
    const glossary = await processGlossary(rawGlossary)
    const fields = {
      content: glossary
    }
    createNode({
      ...fields,
      id: createNodeId(`DVC Glossary JSON`),
      internal: {
        type: 'DVCGlossary',
        contentDigest: createContentDigest(fields)
      }
    })
  }
}
