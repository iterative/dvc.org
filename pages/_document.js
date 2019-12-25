import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import {
  META_BASE_TITLE,
  META_DESCRIPTION,
  META_KEYWORDS,
  META_SOCIAL_IMAGE
} from '../src/consts'

const inject = str => (
  <div className="inject" dangerouslySetInnerHTML={{ __html: str }} />
)

export default class Page extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    )
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render() {
    return (
      <>
        <html lang="en">
          <Head>
            <meta charSet="utf-8" />
            <meta name="description" content={META_DESCRIPTION} />
            <meta name="keywords" content={META_KEYWORDS} />
            <meta
              prefix="og: http://ogp.me/ns#"
              property="og:image"
              content={META_SOCIAL_IMAGE}
            />
            <meta
              prefix="og: http://ogp.me/ns#"
              property="og:image:secure_url"
              content={META_SOCIAL_IMAGE}
            />
            <meta
              prefix="og: http://ogp.me/ns#"
              property="og:description"
              content={META_DESCRIPTION}
            />
            <meta
              prefix="og: http://ogp.me/ns#"
              property="og:title"
              content={META_BASE_TITLE}
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={META_SOCIAL_IMAGE} />
            <meta name="twitter:description" content={META_DESCRIPTION} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0,
              user-scalable=0"
            />
            <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
            <link
              rel="shortcut icon"
              type="image/vnd.microsoft.icon"
              href="/favicon.ico"
            />
            <link
              rel="icon"
              type="image/png"
              href="/favicon-32x32.png"
              sizes="32x32"
            />
            <link
              rel="icon"
              type="image/png"
              href="/favicon-16x16.png"
              sizes="16x16"
            />
            <link rel="stylesheet" type="text/css" href="/fonts/fonts.css" />
            <link
              rel="stylesheet"
              type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css"
            />
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/docsearch.js@2.6.2/dist/cdn/docsearch.min.css"
            />
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.4.0/css/perfect-scrollbar.min.css"
            />
            <script
              type="text/javascript"
              src="https://cdn.jsdelivr.net/npm/docsearch.js@2.6.2/dist/cdn/docsearch.min.js"
            />
            {this.props.styleTags}
          </Head>
          <body>
            <Main />
            <NextScript />
            {inject(
              `
            <script
                type="text/javascript"
                src="//downloads.mailchimp.com/js/signup-forms/popup/embed.js"
                data-dojo-config="usePlainJson: true, isDebug: false">
            </script>
            <script type="text/javascript">
              function showPopup() {
                document.cookie = "MCPopupClosed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
                document.cookie = "MCPopupSubscribed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

                require(["mojo/signup-forms/Loader"], function(L) {
                  L.start({"baseUrl":"mc.us18.list-manage.com","uuid":"00d8c23945d0bb53d4a4c8c74","lid":"b36ebfc8ca"})
                })
              }
            </script>`
            )}
          </body>
        </html>
      </>
    )
  }
}
