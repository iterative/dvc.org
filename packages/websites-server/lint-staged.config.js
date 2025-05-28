module.exports = {
  '*.json': 'prettier --write',
  '*.md': 'prettier --write',
  '*.mdx': 'prettier --write',
  '*.{js,jsx}': ['prettier --write', 'eslint --fix']
}
