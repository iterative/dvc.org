const flow = require('lodash/flow')
const constant = require('lodash/constant')
const visit = require('unist-util-visit')

const gatsbyRemarkDvcLinker = require('.')
const apiLinker = require('./apiLinker')
const commandLinker = require('./commandLinker')

const { buildAst } = require('./helpers')

describe('gatsby-remark-dvc-linker', () => {
  api = {
    inlineCode: '`dvc.api.get_url()`',
    url: '[`dvc.api.get_url()`](/doc/api-reference/get_url)'
  }

  apiRoot = {
    inlineCode: '`dvc.api`',
    url: '[`dvc.api`](/doc/api-reference/)'
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
      const ast = buildAst(apiRoot.inlineCode)
      visit(ast, 'inlineCode', flow([Array, apiLinker, constant(undefined)]))
      expect(ast).toEqual(buildAst(apiRoot.url))
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
