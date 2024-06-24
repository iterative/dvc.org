const cookieConsentConfig = {
  categories: {
    necessary: {
      enabled: true, // this category is enabled by default
      readOnly: true // this category cannot be disabled
    },
    analytics: {
      enabled: true
    }
  },
  language: {
    default: `en`,
    translations: {
      en: {
        consentModal: {
          title: `Cookie usage`,
          description: `The usage of cookies helps to improve the usage of this website.`,
          acceptAllBtn: `Accept all`,
          acceptNecessaryBtn: `Necessary only`,
          showPreferencesBtn: `Customize preferences`
        },
        preferencesModal: {
          title: `Manage cookie preferences`,
          acceptAllBtn: `Accept all`,
          acceptNecessaryBtn: `Necessary only`,
          savePreferencesBtn: `Accept current selection`,
          closeIconLabel: `Close modal`,
          sections: [
            {
              title: `Type of Cookies`,
              description: `Allowing Analytics cookies helps to improve the website.`
            },
            {
              title: `Strictly Necessary cookies`,
              description: `These cookies are essential for the proper functioning of the website and cannot be disabled.`,
              linkedCategory: `necessary`
            },
            {
              title: `Performance and Analytics`,
              description: `These cookies collect information about how you use the website. All of the data is anonymized and cannot be used to identify you.`,
              linkedCategory: `analytics`
            },
            {
              title: `More information`,
              description: `For any queries in relation to our policy on cookies and your choices, please see our <a href="/security-and-privacy">Privacy Policy</a> or contact us.`
            }
          ]
        }
      }
    }
  }
}

const googleGtagPluginConfig = {
  id: process.env.GATSBY_GTM_ID,

  // Include GTM in development.
  //
  // Defaults to false meaning GTM will only be loaded in production.
  includeInDevelopment: process.env.GTM_INCLUDE_IN_DEV === `true`,

  // datalayer to be set before GTM is loaded
  // should be an object or a function that is executed in the browser
  //
  // Defaults to null
  defaultDataLayer: { platform: `gatsby` }
}

module.exports = {
  cookieConsentConfig,
  googleGtagPluginConfig
}
