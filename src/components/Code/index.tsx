import React from 'react'
import cn from 'classnames'

import dvc from '../../../config/prismjs/dvc-commands'

const dvcRegex = new RegExp(`dvc (?:${dvc.join('|')})`, 'ig')
const usageRegex = new RegExp(
  `(^|\n)\s*(usage|positional arguments|optional arguments)`,
  'ig'
)
const squareArgsRegex = new RegExp(
  /(?<=\[)(?:[^\]\[]+|\[(?:[^\]\[]+|\[[^\]\[]*\])*\])*(?=\])/,
  'ig'
) // regex that matches a square bracketed argument that allows two levels of nested square brackets
const argsRegex = new RegExp(/\-{1,2}[a-zA-Z-]*/, 'ig')

const encodeChars = (rawText: string) => {
  return rawText.replaceAll('<', '&lt;')
}
const pipe = (...args: any[]) => args.reduce((acc, el) => el(acc))
const linkifyArgs = (args: string) => {
  if (args.includes('|')) {
    const argsArr = args.split('|')
    const argsWrappedArr = argsArr.map(linkifyArg)
    return argsWrappedArr.join('|')
  }
  return linkifyArg(args)
}

const linkifyArg = (arg: string) => {
  const dashArgs = arg.match(argsRegex)
  if (!dashArgs) return arg
  if (dashArgs.length > 1) {
    return linkify(arg)
  }
  return `<a class="token args" href='#${dashArgs[0]}'>${arg}</a>`
}
const linkify = (str: string) => {
  return str.replace(argsRegex, linker)
}
const linker = (str: string) => {
  return `<a class="token args" href='#${str.replaceAll(' ', '_')}'>${str}</a>`
}

const wrapUsage = (text: string) =>
  text.replace(usageRegex, `<span class="token usage">$&</span>`)
const wrapDvc = (text: string) =>
  text.replace(dvcRegex, `<span class="token dvc">$&</span>`)
const linkifyArgsSquared = (text: string) =>
  text.replace(squareArgsRegex, linkifyArgs)

export const wrapWithTags = (text: string) => {
  text = encodeChars(text)
  return pipe(text, wrapUsage, wrapDvc, linkifyArgsSquared)
}

const formatText = (text: string) => {
  const wrapped = wrapWithTags(text)
  return wrapped
}

const Code: React.FC<{ className: string }> = ({ className, children }) => {
  if (className === 'language-usage') {
    const codeText = Array.isArray(children)
      ? children.join('')
      : String(children) || ''
    const ReactText = formatText(codeText)
    return (
      <code
        className={cn(className)}
        dangerouslySetInnerHTML={{ __html: ReactText }}
      ></code>
    )
  }
  return <code className={cn(className)}>{children}</code>
}

export default Code
