/* eslint jsx-a11y/html-has-lang:0 */
import React from 'react'

interface IHTMLProps {
  htmlAttributes: object
  headComponents: Array<React.ReactNode>
  bodyAttributes: object
  preBodyComponents: Array<React.ReactNode>
  body: string
  postBodyComponents: Array<React.ReactNode>
}

const HTML: React.FC<IHTMLProps> = props => {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

export default HTML
