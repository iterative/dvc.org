module.exports = {
  '*.css': ['prettier --write', 'stylelint --fix'],
  '*.json': 'prettier --write',
  '*.md': 'prettier --write',
  '*.mdx': 'prettier --write',
  '*.ts?(x)': () => 'yarn lint-ts',
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix']
}
