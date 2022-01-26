const gatsbyRemarkDvctableFiller = require('.')

const { buildAst } = require('../gatsby-remark-dvc-linker/helpers.js')

describe('gatsby-remark-dvctable-filler', () => {
  it('fills dvctable', () => {
    const ast = buildAst('```dvctable\n$get-started-exp-show-combined\n```')
    gatsbyRemarkDvctableFiller({ markdownAST: ast })
    expect(ast).toEqual(
      buildAst(
        '```dvctable\n ───────────────────────────────────────────────────────────────────────────────────────────────────────── \n  neutral:**Experiment**                  metric:**avg_prec**   metric:**roc_auc**   param:**featurize.max_features**   param:**train.n_est**   param:**train.min_split**  \n ───────────────────────────────────────────────────────────────────────────────────────────────────────── \n  workspace                    0.60405    0.9608   3000                     100           64               \n  random-forest-experiments    0.60405    0.9608   3000                     100           64               \n  ├── 88ecb7e [exp-8260f]      0.51799   0.92333   500                      100           64               \n  ├── e720fcc [exp-0182d]      0.58589     0.945   2000                     100           64               \n  └── 2de2f53 [exp-540e3]      0.55669   0.93516   1000                     100           64               \n ───────────────────────────────────────────────────────────────────────────────────────────────────────── \n\n```'
      )
    )
  })
})
