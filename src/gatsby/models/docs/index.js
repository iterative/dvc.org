const skipDocs = Boolean(process.env.SKIP_DOCS)

const base = {
  createSchemaCustomization: require('./createSchemaCustomization.js')
}

module.exports = skipDocs
  ? base
  : {
      ...base,
      createPages: require('./createPages.js'),
      onCreateMarkdownContentNode: require('./onCreateMarkdownContentNode.js')
    }
