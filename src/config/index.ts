const config = {
  algolia: {
    appId: String(process.env.GATSBY_ALGOLIA_APP_ID),
    searchKey: String(process.env.GATSBY_ALGOLIA_SEARCH_KEY),
    adminKey: process.env.ALGOLIA_ADMIN_KEY,
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME || 'dev_blogs'
  }
}

export default config
