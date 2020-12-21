/* eslint-env node */

const flow = require('lodash/flow')
const constant = require('lodash/constant')
const visit = require('unist-util-visit')

const apiLinker = require('./apiLinker')
const commandLinker = require('./commandLinker')
const simpleLinker = require('./simpleLinker')

// Lifting up the AST visitor in order not to repeat the
// calculations times the amount of linkers we have
module.exports = ({ markdownAST }) => {
  visit(
    markdownAST,
    'inlineCode',
    flow([Array, commandLinker, apiLinker, simpleLinker, constant(undefined)])
  )
  return markdownAST
}
