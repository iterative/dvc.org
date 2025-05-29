const path = require('path')

module.exports = {
  docsPath: path.resolve('content', 'docs'),
  docsInstanceName: 'iterative-docs',
  glossaryPath: path.resolve('content', 'docs', 'user-guide', 'basic-concepts'),
  glossaryInstanceName: 'iterative-glossary',
  argsLinkerPath: ['command-reference', `ref`, 'cli-reference'],
  sentry: true
}
