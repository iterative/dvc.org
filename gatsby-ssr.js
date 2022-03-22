/* eslint-env node */
const React = require('react')

const onRenderBody = ({ setHeadComponents }) => {
  return setHeadComponents([
    <script
      key="plausible-custom-events"
      dangerouslySetInnerHTML={{
        __html:
          'window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }'
      }}
    />
  ])
}

exports.onRenderBody = onRenderBody
