export const onRenderBody = (
  { setHeadComponents },
  { domain, apiEndpoint, scriptSrc }
) => {
  setHeadComponents([
    <script
      key="plausible"
      defer
      data-domain={domain}
      data-api={apiEndpoint}
      src={scriptSrc}
    />,
    <script
      key="gtag-consent"
      id="gtag-consent"
      dangerouslySetInnerHTML={{
        __html: `
window.plausible = window.plausible || function() {
    (plausible.q = plausible.q || []).push(arguments)
}, plausible.init = plausible.init || function(i) {
    plausible.o = i || {}
};
plausible.init({
    endpoint: "${apiEndpoint}",
})
      `
      }}
    />
  ])
}
