const config = {
  algolia: {
    appId: process.env.ALGOLIA_APP_ID,
    searchKey: process.env.ALGOLIA_SEARCH_KEY,
    adminKey: process.env.ALGOLIA_ADMIN_KEY,
    indexName: process.env.ALGOLIA_INDEX_NAME || 'dev_blogs'
  }
}

export default config
