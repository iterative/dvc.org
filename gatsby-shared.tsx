import { GatsbyBrowser, Script } from 'gatsby'

const GATSBY_REO_DEV_CLIENT_ID = process.env.GATSBY_REO_DEV_CLIENT_ID

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element
}) => {
  return (
    <>
      {element}
      {GATSBY_REO_DEV_CLIENT_ID && (
        <Script id="rev-dot-dev">
          {` !function(){var e,t,n;e="${GATSBY_REO_DEV_CLIENT_ID}",t=function(){Reo.init({clientID:"${GATSBY_REO_DEV_CLIENT_ID}"})},(n=document.createElement("script")).src="https://static.reo.dev/"+e+"/reo.js",n.async=!0,n.onload=t,document.head.appendChild(n)}();`}
        </Script>
      )}
    </>
  )
}
