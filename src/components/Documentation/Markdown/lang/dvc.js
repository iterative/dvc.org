/* global exports:readonly */

'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

let _javascript = function(hljs) {
  let VAR = {
    className: 'variable',
    variants: [{ begin: /\$[\w\d#@][\w\d_]*/ }, { begin: /\$\{(.*?)}/ }]
  }
  let QUOTE_STRING = {
    className: 'string',
    begin: /"/,
    end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VAR,
      {
        className: 'variable',
        begin: /\$\(/,
        end: /\)/,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  }
  let APOS_STRING = {
    className: 'string',
    begin: /'/,
    end: /'/
  }

  return {
    aliases: ['dvc'],
    contains: [
      {
        begin: /^\s*\$/,
        end: /\n|$/,
        returnBegin: true,
        keywords: {
          keyword:
            'ls cat vi mkdir cd wget du python cp export echo pip curl tar ' +
            'exec autoload sudo unzip rm tree file md5 source virtualenv ' +
            'which npm yarn choco'
        },
        contains: [
          {
            begin: /^\s*\$\s(dvc|git) [a-z-]+/,
            returnBegin: true,
            contains: [
              {
                begin: /^\s*\$\s/,
                className: 'skipped'
              },
              {
                begin: /git [a-z-]+/,
                keywords: {
                  keyword:
                    'git commit status pull push fetch add init checkout ' +
                    'merge clone tag'
                }
              },
              {
                begin: /dvc [a-z-]+/,
                lexemes: '[a-z-]+',
                keywords: {
                  built_in:
                    'help dvc init add import-url checkout run pull push ' +
                    'fetch status repro remove move gc config remote metrics ' +
                    'install root lock unlock pipeline destroy unprotect ' +
                    'commit cache pkg tag diff version get get-url import ' +
                    'update'
                },
                className: 'strong'
              }
            ]
          },
          {
            begin: /^\s*\$\s/,
            className: 'skipped'
          },
          {
            begin: /\\\n/
          },
          QUOTE_STRING,
          APOS_STRING,
          VAR,
          hljs.HASH_COMMENT_MODE
        ]
      },
      hljs.HASH_COMMENT_MODE,
      {
        begin: /^\s*[^\s#$]/,
        end: /\n|$/,
        className: 'meta'
      }
    ]
  }
}

let _javascript2 = _interopRequireDefault(_javascript)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

exports.default = _javascript2.default
