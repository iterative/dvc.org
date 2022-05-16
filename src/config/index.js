const config = {
  algolia: {
    appId: process.env.GATSBY_ALGOLIA_APP_ID || 'B87HVF62EF',
    searchKey:
      process.env.GATSBY_ALGOLIA_SEARCH_KEY ||
      'cd45432547aa825db0ab63f4d90e13e3',
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME || 'dvc_blogs',
    adminKey: process.env.ALGOLIA_ADMIN_KEY || '',
    skipIndexing: process.env.CI || false
  },
  cms: {
    name: process.env.GATSBY_CMS_NAME || 'github',
    repo: process.env.GATSBY_CMS_REPO || 'iterative/dvc.org',
    branch: process.env.GATSBY_CMS_BRANCH || 'master',
    base_url: process.env.GATSBY_CMS_BASE_URL || 'https://dvc.org',
    auth_endpoint: process.env.GATSBY_CMS_AUTH_ENDPOINT || '/api/github/auth'
  },
  oauth2: {
    client: {
      id: process.env.OAUTH_CLIENT_ID,
      secret: process.env.OAUTH_CLIENT_SECRET
    },
    auth: {
      tokenHost: `https://github.com`,
      tokenPath: `/login/oauth/access_token`,
      authorizePath: `/login/oauth/authorize`
    }
  }
}

module.exports = config
