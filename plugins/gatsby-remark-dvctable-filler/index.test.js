const gatsbyRemarkDvctableFiller = require('.')

const { buildAst } = require('../gatsby-remark-dvc-linker/helpers.js')

describe('gatsby-remark-dvctable-filler', () => {
  it('fills dvctable', () => {
    const ast = buildAst('```dvctable\n$foo\n```')
    gatsbyRemarkDvctableFiller({ markdownAST: ast })
    expect(ast).toEqual(buildAst('```dvctable\nbar\n```'))
  })
})
