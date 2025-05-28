/* eslint-env node */

// we require prism and load its bash module so we have
// Prism.languages.bash to embed into our DVC language.

const Prism = require('prismjs')
require('prismjs/components/prism-bash')
require('./dvc-hook')
const { bash } = Prism.languages

const dvc = require('./dvc-commands')
const cml = require('./cml-commands')
const mlem = require('./mlem-commands')
const gto = require('./gto-commands')

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

Prism.languages.cli = {
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
      cml: {
        pattern: new RegExp(
          String.raw`${beforeCommand}\b(?:cml (?:${cml.join('|')}))\b`
        ),
        greedy: true,
        lookbehind: true
      },
      mlem: {
        pattern: new RegExp(
          String.raw`${beforeCommand}\b(?:mlem (?:${mlem.join('|')}))\b`
        ),
        greedy: true,
        lookbehind: true
      },
      gto: {
        pattern: new RegExp(
          String.raw`${beforeCommand}\b(?:gto (?:${gto.join('|')}))\b`
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
      ...bash,
      parameter: {
        pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:[.-]\w+)*(?=[=\s]|$)/,
        alias: 'variable',
        lookbehind: true
      }
    }
  },
  comment: {
    pattern: /(^|[\s^"{\\$])#.*/,
    lookbehind: true
  }
}

Prism.languages.dvc = Prism.languages.cli
