import React from 'react'
import cn from 'classnames'

import dvc from '../../../config/prismjs/dvc-commands'

const dvcRegex = new RegExp(`dvc (?:${dvc.join('|')})`, 'ig')
const usageRegex = new RegExp(
  `(^|\n)\s*(usage|positional arguments|optional arguments)`,
  'ig'
)
const squareArgsRegex = new RegExp(/(?<=\[).+?(?=\])/, 'ig')
const argsRegex = new RegExp(/\-{1,2}[a-zA-Z-]*/, 'ig')

const encodeChars = (rawText: string) => {
  return rawText.replaceAll('<', '&lt;')
}
const pipe = (...args: any[]) => args.reduce((acc, el) => el(acc))
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
const linkifyArgs = (text: string) => text.replace(squareArgsRegex, linkify)

export const wrapWithTags = (text: string) => {
  text = encodeChars(text)
  return pipe(text, wrapUsage, wrapDvc, linkifyArgs)
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
