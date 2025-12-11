export const onRenderBody = (
  { setHeadComponents },
  { settingsId, rulesetId }
) =>
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
      data-ruleset-id={rulesetId}
      async
    />,
    <script
      key="gtag-consent"
      id="gtag-consent"
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag("consent", "default", {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied",
          functionality_storage: "denied",
          personalization_storage: "denied",
          security_storage: "granted"
        });
      `
      }}
    />
  ])
