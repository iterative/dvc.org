'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _javascript = function(hljs) {
  var QUOTE_STRING = {
    className: 'string',
    begin: /"/,
    end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      {
        className: 'variable',
        begin: /\$\(/,
        end: /\)/,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  }

  return {
    aliases: ['usage'],
    contains: [
      {
        begin: /^\s*(usage:|positional arguments:|optional arguments:)/,
        end: /\n|\Z/,
        lexemes: /\b-?[a-z\._]+\b/,
        keywords: {
          keyword: 'usage arguments optional positional'
        },
        contains: [
          {
            begin: / dvc [a-z]+/,
            keywords: {
              built_in:
                'help dvc init add import checkout run pull push fetch status repro ' +
                'remove move gc config remote metrics install root lock unlock ' +
                'pipeline destroy unprotect commit cache diff tag pkg version'
            },
            className: 'strong'
          }
        ]
      },

      QUOTE_STRING,
      hljs.HASH_COMMENT_MODE
    ]
  }
}

var _javascript2 = _interopRequireDefault(_javascript)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

exports.default = _javascript2.default
