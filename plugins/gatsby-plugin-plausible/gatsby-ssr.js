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
    />
  ])
}
