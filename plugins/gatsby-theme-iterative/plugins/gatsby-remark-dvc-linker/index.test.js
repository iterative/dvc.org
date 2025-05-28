const flow = require('lodash/flow')
const constant = require('lodash/constant')

const gatsbyRemarkDvcLinker = require('.')
const apiLinker = require('./apiLinker')
const commandLinker = require('./commandLinker')
const liveLinker = require('./liveLinker')

const { buildAst } = require('./helpers')

describe('gatsby-remark-dvc-linker', async () => {
  const { visit } = await import('unist-util-visit')
  const api = {
    inlineCode: '`dvc.api.get_url()`',
    url: '[`dvc.api.get_url()`](/doc/api-reference/get_url)'
  }

  const apiRoot = {
    inlineCode: '`dvc.api`',
    url: '[`dvc.api`](/doc/api-reference/)'
  }

  const command = {
    inlineCode: '`dvc get`',
    url: '[`dvc get`](/doc/command-reference/get)'
  }

  const live = {
    inlineCode: '`Live.log()`',
    url: '[`Live.log()`](/doc/dvclive/live/log)'
  }

  it('composes apiLinker and commandLinker', () => {
    const ast = buildAst(`${api.inlineCode} ${command.inlineCode}`)
    gatsbyRemarkDvcLinker({ markdownAST: ast })
    expect(ast).toEqual(buildAst(`${api.url} ${command.url}`))
  })

  it('transforms DVCLive API reference to a link', () => {
    const ast = buildAst(live.inlineCode)
    visit(ast, 'inlineCode', flow([Array, liveLinker, constant(undefined)]))
    expect(ast).toEqual(buildAst(live.url))
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
