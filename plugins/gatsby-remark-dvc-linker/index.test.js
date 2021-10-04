const flow = require('lodash/flow')
const constant = require('lodash/constant')
const visit = require('unist-util-visit')

const gatsbyRemarkDvcLinker = require('.')
const apiLinker = require('./apiLinker')
const commandLinker = require('./commandLinker')
const liveLinker = require('./liveLinker')

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

  live = {
    inlineCode: '`dvclive.log()`',
    url: '[`dvclive.log()`](/doc/dvclive/api-reference/log)'
  }

  liveInit = {
    inlineCode: '`Live()`',
    url: '[`Live()`](/doc/dvclive/api-reference/live)'
  }

  it('composes apiLinker and commandLinker', () => {
    const ast = buildAst(`${api.inlineCode} ${command.inlineCode}`)
    gatsbyRemarkDvcLinker({ markdownAST: ast })
    expect(ast).toEqual(buildAst(`${api.url} ${command.url}`))
  })

  describe('liveLinker', () => {
    it('transforms DVCLive API reference to a link', () => {
      const ast = buildAst(live.inlineCode)
      visit(ast, 'inlineCode', flow([Array, liveLinker, constant(undefined)]))
      expect(ast).toEqual(buildAst(live.url))
    })

    it('transforms DVCLive init reference to a link', () => {
      const ast = buildAst(liveInit.inlineCode)
      visit(ast, 'inlineCode', flow([Array, liveLinker, constant(undefined)]))
      expect(ast).toEqual(buildAst(liveInit.url))
    })
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
