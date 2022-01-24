/* eslint-env node */
const Prism = require('prismjs')

const getTableCellBgColorRegex = color =>
  new RegExp(String.raw`(?<=[│┃])\s+${color}:(?:(?![│┃]).)+(?=[│┃])`)

const getTableTextBgColorRegex = color => new RegExp(String.raw`${color}:\S+`)

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
    pattern: getTableCellBgColorRegex('(white|neutral)'),
    inside: {
      hide: {
        pattern: /(white|neutral):/
      },
      ...boldAndItalicConfig
    }
  },
  'bg-yellow': {
    pattern: getTableCellBgColorRegex('(yellow|metric)'),
    inside: {
      hide: {
        pattern: /(yellow|metric):/
      },
      ...boldAndItalicConfig
    }
  },
  'bg-blue': {
    pattern: getTableCellBgColorRegex('(blue|param)'),
    inside: {
      hide: {
        pattern: /(blue|param):/
      },
      ...boldAndItalicConfig
    }
  },
  ...boldAndItalicConfig
}

Prism.languages.dvctablehorizontals = {
  rows: {
    pattern: /((?<=^|\n)\s[^─][\s\S]*?(:?\n|$))+/,
    inside: {
      'bg-white': {
        pattern: getTableTextBgColorRegex('(white|neutral)'),
        inside: {
          hide: {
            pattern: /(white|neutral):/
          },
          ...boldAndItalicConfig
        }
      },
      'bg-yellow': {
        pattern: getTableTextBgColorRegex('(yellow|metric)'),
        inside: {
          hide: {
            pattern: /(yellow|metric):/
          },
          ...boldAndItalicConfig
        }
      },
      'bg-blue': {
        pattern: getTableTextBgColorRegex('(blue|param)'),
        inside: {
          hide: {
            pattern: /(blue|param):/
          },
          ...boldAndItalicConfig
        }
      },
      ...boldAndItalicConfig
    }
  }
}
