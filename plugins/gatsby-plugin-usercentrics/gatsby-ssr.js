export const onRenderBody = ({ setHeadComponents }, { settingsId }) =>
  setHeadComponents([
    <script
      key="usercentrics-autoblocker"
      src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
    />,
    <script
      key="usercentrics-cmp"
      id="usercentrics-cmp"
      src="https://web.cmp.usercentrics.eu/ui/loader.js"
      data-settings-id={settingsId}
      async
    />
  ])
