const gatsbyRemarkDvctableFiller = require('.')
const tables = require('./tables.js')

const { buildAst } = require('../gatsby-remark-dvc-linker/helpers.js')

describe('gatsby-remark-dvctable-filler', () => {
  it('fills dvctable', () => {
    const ast = buildAst('```dvctable\n$get-started-exp-show-combined\n```')
    gatsbyRemarkDvctableFiller({ markdownAST: ast })
    let table = tables.find(
      o => o.placeholder === '$get-started-exp-show-combined'
    )
    expect(ast).toEqual(
      buildAst('```dvctable\n' + `${table.replacement}` + '\n```')
    )
  })
})
