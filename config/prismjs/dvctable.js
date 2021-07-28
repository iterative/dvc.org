/* eslint-env node */
const Prism = require('prismjs')

const getTableBgColorRegex = color =>
  new RegExp(String.raw`(?<=[│┃])\s+\*{0,2}${color}:(?:(?![│┃]).)+(?=[│┃])`)
const boldAndItalicConfig = {
  bold: {
    pattern: /\*\*(?:(?!\*\*).)+\*\*/,
    inside: {
      hide: /\*\*/
    }
  },
  italic: {
    pattern: /\*(?:(?!\*).)+\*/,
    inside: {
      hide: /\*/
    }
  }
}

Prism.languages.dvctable = {
  'bg-white': {
    pattern: getTableBgColorRegex('(white|neutral)'),
    inside: {
      hide: {
        pattern: /(white|neutral):/
      },
      ...boldAndItalicConfig
    }
  },
  'bg-yellow': {
    pattern: getTableBgColorRegex('(yellow|metric)'),
    inside: {
      hide: {
        pattern: /(yellow|metric):/
      },
      ...boldAndItalicConfig
    }
  },
  'bg-blue': {
    pattern: getTableBgColorRegex('(blue|param)'),
    inside: {
      hide: {
        pattern: /(blue|param):/
      },
      ...boldAndItalicConfig
    }
  },
  ...boldAndItalicConfig
}
