import { GatsbyBrowser, Script } from 'gatsby'

const GATSBY_REO_DEV_CLIENT_ID = process.env.GATSBY_REO_DEV_CLIENT_ID
const GATSBY_APOLLO_IO_APP_ID = process.env.GATSBY_APOLLO_IO_APP_ID
const GATSBY_USERCENTRICS_SETTINGS_ID =
  process.env.GATSBY_USERCENTRICS_SETTINGS_ID

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
      {GATSBY_APOLLO_IO_APP_ID && (
        <Script id="apollo-io">
          {`function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"${GATSBY_APOLLO_IO_APP_ID}"})},document.head.appendChild(o)}initApollo();`}
        </Script>
      )}
      {GATSBY_USERCENTRICS_SETTINGS_ID && (
        <>
          <Script src="https://web.cmp.usercentrics.eu/modules/autoblocker.js" />
          <Script
            id="usercentrics-cmp"
            src="https://web.cmp.usercentrics.eu/ui/loader.js"
            data-settings-id={GATSBY_USERCENTRICS_SETTINGS_ID}
            async
          />
        </>
      )}
    </>
  )
}
