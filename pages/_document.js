import Document, { Head, Main, NextScript } from 'next/document'
import { injectGlobal, ServerStyleSheet } from 'styled-components'
import reset from 'styled-reset'
import { global } from '../src/styles'
import Router from 'next/router'

const TITLE = `Data Science Version Control System`
const DESCRIPTION = `Open-source Version Control System for Data Science Projects. Data Version Control.`
const KEYWORDS = `data version control machine learning models management`

const dev = process.env.NODE_ENV !== 'production'

injectGlobal`
  ${reset}
  ${global}
`

const inject = str => (
  <div className="inject" dangerouslySetInnerHTML={{ __html: str }} />
)

export default class MyDocument extends Document {
  static getInitialProps({ req, res, renderPage }) {
    let redirect

    if (req.headers['host'].match(/^www/) !== null) {
      redirect =
        'https://' + req.headers['host'].replace(/^www\./, '') + req.url
    } else if (req.headers['x-forwarded-proto'] !== 'https' && !dev) {
      const host = req.headers['host'].replace(/^www\./, '')
      redirect = 'https://' + host + req.url
    }

    if (redirect) {
      if (res) {
        res.writeHead(302, {
          Location: redirect
        })
        res.end()
        res.finished = true
      } else {
        Router.push(redirect)
      }
    }

    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    )
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render() {
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <title>{TITLE}</title>
          <meta name="description" content={DESCRIPTION} />
          <meta name="keywords" content={KEYWORDS} />
          <meta prefix="og: http://ogp.me/ns#" property="og:image" content="http://dvc.org/static/social-share.png" />
          <meta prefix="og: http://ogp.me/ns#" property="og:image:secure_url" content="https://dvc.org/static/social-share.png" />
          <meta property="twitter:image" content="https://dvc.org/static/social-share.png" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
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
            rel="shortcut icon"
            type="image/png"
            href="/static/favicon.ico"
          />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
          {inject(
            `
            <script type="text/javascript" src="//downloads.mailchimp.com/js/signup-forms/popup/embed.js" data-dojo-config="usePlainJson: true, isDebug: false"></script>
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
    )
  }
}
