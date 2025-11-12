/* eslint jsx-a11y/html-has-lang:0 */

interface IHTMLProps {
  htmlAttributes: Record<string, unknown>
  headComponents: Array<React.ReactNode>
  bodyAttributes: Record<string, unknown>
  preBodyComponents: Array<React.ReactNode>
  body: string
  postBodyComponents: Array<React.ReactNode>
}

const DISABLE_INDEXING = process.env.DISABLE_INDEXING === 'true'

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
        {DISABLE_INDEXING && <meta name="robots" content="noindex, nofollow" />}
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
