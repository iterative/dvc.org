const consts = {
  CLI_REGEXP: /dvc\s+[a-z][a-z-.]*/,
  COMMAND_REGEXP: /^[a-z][a-z-]*$/,
  ARGS_REGEXP: new RegExp(/-{1,2}[a-zA-Z-]*/, 'ig'),

  COMMAND_ROOT: '/command-reference/',
  CML_COMMAND_ROOT: '/doc/ref/',

  CLI_API_REGEXP: /dvc.api([a-z-._]*\(\)$)?/,
  METHOD_REGEXP: /^[a-z-._]*\(\)$/,

  API_ROOT: '/api-reference/',

  SIDEBAR_UPPERCASE_KEYWORDS_REGEX: /dvc|api/g,
  SIDEBAR_PATH_ROOT: '',
  SIDEBAR_FILE_ROOT: '/docs/',
  SIDEBAR_FILE_EXTENSION: '.md',
  DOCS_PREFIX: '',
  MAIN_SITE_URL: 'https://dvc.org'
}

module.exports = consts
