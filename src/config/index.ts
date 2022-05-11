const config = {
  algolia: {
    appId: process.env.GATSBY_ALGOLIA_APP_ID || 'B87HVF62EF',
    searchKey:
      process.env.GATSBY_ALGOLIA_SEARCH_KEY ||
      'cd45432547aa825db0ab63f4d90e13e3',
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME || 'dvc_blogs'
  },
  cms: {
    name: process.env.GATSBY_CMS_NAME || 'github',
    repo: process.env.GATSBY_CMS_NAME || 'iterative/dvc.org',
    branch: process.env.GATSBY_CMS_BRANCH || 'master',
    base_url: process.env.GATSBY_CMS_BASE_URL || 'https://dvc.org'
  }
}

export default config
