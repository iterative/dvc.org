import { Parser as HtmlToReactParser } from 'html-to-react'

const htmlToReactParser = new HtmlToReactParser()

export function htmlToReact(html: any) {
  return htmlToReactParser.parse(html)
}
