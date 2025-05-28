const consts = {
  CLI_REGEXP: /(dvc|cml|mlem|gto)\s+[a-z][a-z-.]*/,
  COMMAND_REGEXP: /^[a-z][a-z-]*$/,
  ARGS_REGEXP: new RegExp(/-{1,2}[a-zA-Z-]*/, 'ig'),

  COMMAND_ROOT: '/doc/command-reference/',
  CML_COMMAND_ROOT: '/doc/ref/',
  GTO_COMMAND_ROOT: '/doc/gto/command-reference/',

  CLI_API_REGEXP: /(dvc|mlem).api([a-z-._]*\(\)$)?/,
  METHOD_REGEXP: /^[a-z-._]*\(\)$/,

  API_ROOT: '/doc/api-reference/',

  SIDEBAR_UPPERCASE_KEYWORDS_REGEX: /dvc|cml|api|mlem|ml|ldb|gto/g,
  SIDEBAR_PATH_ROOT: '/doc',
  SIDEBAR_FILE_ROOT: '/docs/',
  SIDEBAR_FILE_EXTENSION: '.md'
}

module.exports = consts
