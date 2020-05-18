const flow = require('lodash/flow')
const constant = require('lodash/constant')

const unified = require('unified')
const remarkHtml = require('remark-html')
const remarkParse = require('remark-parse')
const visit = require('unist-util-visit')
const removePosition = require('unist-util-remove-position')

const apiLinker = require('./apiLinker')
const commandLinker = require('./commandLinker')
const gatsbyRemarkDvcLinker = require('.')

// We do not need to consider the position of the AST nodes
const buildAst = mdToBuild =>
  removePosition(unified().use(remarkHtml).use(remarkParse).parse(mdToBuild))

describe('gatsby-remark-dvc-linker', () => {
  api = {
    inlineCode: '`dvc.api.get_url()`',
    url: '[`dvc.api.get_url()`](/doc/api-reference/get_url)'
  }

  command = {
    inlineCode: '`dvc get`',
    url: '[`dvc get`](/doc/command-reference/get)'
  }

  it('composes apiLinker and commandLinker', () => {
    const ast = buildAst(`${api.inlineCode} ${command.inlineCode}`)
    gatsbyRemarkDvcLinker({ markdownAST: ast })
    expect(ast).toEqual(buildAst(`${api.url} ${command.url}`))
  })

  describe('apiLinker', () => {
    it('transforms API reference to a link', () => {
      const ast = buildAst(api.inlineCode)
      visit(ast, 'inlineCode', flow([Array, apiLinker, constant(undefined)]))
      expect(ast).toEqual(buildAst(api.url))
    })

    it('transforms root API reference to a link', () => {
      const ast = buildAst('`dvc.api`')
      visit(ast, 'inlineCode', flow([Array, apiLinker, constant(undefined)]))
      expect(ast).toEqual(buildAst('[`dvc.api`](/doc/api-reference/)'))
    })
  })

  describe('commandLinker', () => {
    it('transforms command reference to a link', () => {
      const ast = buildAst(command.inlineCode)
      visit(
        ast,
        'inlineCode',
        flow([Array, commandLinker, constant(undefined)])
      )
      expect(ast).toEqual(buildAst(command.url))
    })
  })
})
