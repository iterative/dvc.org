"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

let _javascript = function(hljs) {
  let VAR = {
    className: 'variable',
    variants: [
      {begin: /\$[\w\d#@][\w\d_]*/},
      {begin: /\$\{(.*?)}/}
    ]
  };
  let QUOTE_STRING = {
    className: 'string',
    begin: /"/, end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VAR,
      {
        className: 'variable',
        begin: /\$\(/, end: /\)/,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  let APOS_STRING = {
    className: 'string',
    begin: /'/, end: /'/
  };

  return {
    aliases: ['dvc'],
    contains: [
      {
        begin: /^\s*\$/,
        className: 'skipped',
      },
      {
        begin: /^\s\s\s\s(?!(\$|\s))/,
        end: /([^\\]\n)|\Z|\n/,
        className: 'meta',
      },
      {
        begin: /\s/,
        end: /([^\\]\n)|\Z|\n/,
        contains: [
          {
            begin: /\bls\b|\bcat\b|\bvi\b|\bmkdir\b|\bcd\b|\bwget\b|\bdu\b|\bpython\b|\bcp\b|\bexport\b|\becho\b|\bpip\b|\bcurl\b|\btar\b|\bexec\b|\bautoload\b|\bsudo\b|\bunzip\b|\brm\b|\btree\b|\bfile\b|\bmd5\b|\bsource\b|\bvirtualenv\b/,
            keywords: {
              keyword:
                'ls cat vi mkdir cd wget du python cp export echo pip curl tar exec autoload sudo unzip rm tree file md5 source virtualenv git commit status pull push fetch add init checkout merge clone',
            }
          },
          {
            begin: /git [a-z\-]+/,
            keywords: {
              keyword:
                'ls cat vi mkdir cd wget du python cp export echo pip curl tar exec autoload sudo unzip rm tree file md5 source virtualenv git commit status pull push fetch add init checkout merge clone',
            }
          },
          {
            begin: /dvc [a-z\-]+/,
            keywords:{
              built_in:
                'help dvc init add import checkout run pull push fetch status repro remove move gc config remote metrics install root lock unlock pipeline destroy unprotect commit cache pkg tag diff',
            }
          },
          QUOTE_STRING,
          APOS_STRING,
          VAR,
          hljs.HASH_COMMENT_MODE
        ]
      },
      hljs.HASH_COMMENT_MODE
    ],

  };
};

let _javascript2 = _interopRequireDefault(_javascript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _javascript2.default;
