const unified = require('unified')
const parse = require('rehype-parse')
const stringify = require('rehype-stringify')

/** HAST - Hypertext Abstract Syntax Tree */
function convertHtmlToHast(htmlString) {
  return unified().use(parse, { fragment: true }).parse(htmlString)
}

function convertHastToHtml(htmlAst) {
  return unified().use(stringify).stringify(htmlAst)
}

module.exports = {
  convertHastToHtml,
  convertHtmlToHast
}
