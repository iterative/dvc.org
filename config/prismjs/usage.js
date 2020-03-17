/* eslint-env node */

const dvc = require('./dvc-commands')
const Prism = require('prismjs')

Prism.languages.usage = {
  dvc: {
    pattern: new RegExp(`dvc (?:${dvc.join('|')})`)
  },
  usage: {
    pattern: /(^|\n)\s*(usage|positional arguments|optional arguments)/
  }
}
