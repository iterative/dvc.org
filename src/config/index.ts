const config = {
  algolia: {
    appId: process.env.GATSBY_ALGOLIA_APP_ID || 'B87HVF62EF',
    searchKey:
      process.env.GATSBY_ALGOLIA_SEARCH_KEY ||
      'cd45432547aa825db0ab63f4d90e13e3',
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME || 'dvc_blogs'
  }
}

export default config
