import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

const DESCRIPTION =
  `Open-source version control system for Data Science and Machine Learning ` +
  `projects. Track your data, models, and experiments with a Git-like tool.`
const KEYWORDS = `data version control machine learning models management`

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
            <meta name="description" content={DESCRIPTION} />
            <meta name="keywords" content={KEYWORDS} />
            <meta
              prefix="og: http://ogp.me/ns#"
              property="og:image"
              content="http://dvc.org/static/social-share.png"
            />
            <meta
              prefix="og: http://ogp.me/ns#"
              property="og:image:secure_url"
              content="https://dvc.org/static/social-share.png"
            />
            <meta
              prefix="og: http://ogp.me/ns#"
              property="og:description"
              content="DVC is designed to handle large data files, models, and
              metrics as well as code. DVC is an open-source framework and
              distributed version control system for machine learning projects."
            />
            <meta
              prefix="og: http://ogp.me/ns#"
              property="og:title"
              content="Data Science Version Control System"
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:image"
              content="https://dvc.org/static/social-share.png"
            />
            <meta
              name="twitter:description"
              content="DVC is designed to handle large data files, models, and
              metrics as well as code. DVC is an open-source framework and
              distributed version control system for machine learning projects."
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0,
              user-scalable=0"
            />
            <link
              rel="shortcut icon"
              type="image/x-icon"
              href="/static/favicon.ico"
            />
            <link
              rel="shortcut icon"
              type="image/vnd.microsoft.icon"
              href="/static/favicon.ico"
            />
            <link
              rel="icon"
              type="image/png"
              href="/static/favicon-32x32.png"
              sizes="32x32"
            />
            <link
              rel="icon"
              type="image/png"
              href="/static/favicon-16x16.png"
              sizes="16x16"
            />
            <link
              rel="stylesheet"
              type="text/css"
              href="/static/fonts/fonts.css"
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
