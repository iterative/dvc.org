/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

const Prism = require('prismjs')

// Make sure the $ part of the command prompt in shell
// examples isn't copiable by making it an 'input' token.
Prism.hooks.add('after-tokenize', env => {
  if (env.language !== 'dvc') {
    return
  }

  for (const token of env.tokens) {
    if (token.type === 'line' && /^\$\s+$/.test(token.content[0])) {
      const old = token.content[0]
      token.content[0] = new Prism.Token('input', old, null, old, false)
    }
  }
})
