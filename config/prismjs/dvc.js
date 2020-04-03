/* eslint-env node */

// we require prism and load its bash module so we have
// Prism.languages.bash to embed into our DVC language.

const Prism = require('prismjs')
require('prismjs/components/prism-bash')
require('./dvc-hook')
const { bash } = Prism.languages

const dvc = require('./dvc-commands')

// Command arrays are intentionally reverse sorted
// to prevent shorter matches before longer ones

const git = [
  'tag',
  'status',
  'remote update',
  'remote rename',
  'remote remove',
  'remote add',
  'remote',
  'push',
  'pull',
  'merge',
  'init',
  'fetch',
  'commit',
  'clone',
  'checkout',
  'add'
]

const beforeCommand = String.raw`(\$[\s(]+|;\s*)`

Prism.languages.dvc = {
  line: {
    pattern: /(?<=(^|\n))\$[\s\S]*?[^\\](:?\n|$)/,
    inside: {
      dvc: {
        pattern: new RegExp(
          String.raw`${beforeCommand}\b(?:dvc (?:${dvc.join('|')}))\b`
        ),
        greedy: true,
        lookbehind: true
      },
      git: {
        pattern: new RegExp(
          String.raw`${beforeCommand}\b(?:git (?:${git.join('|')}))\b`
        ),
        greedy: true,
        lookbehind: true
      },
      command: {
        pattern: new RegExp(String.raw`${beforeCommand}\b[a-zA-Z0-9\-_]+\b`),
        greedy: true,
        lookbehind: true
      },
      ...bash
    }
  },
  comment: bash.comment
}
