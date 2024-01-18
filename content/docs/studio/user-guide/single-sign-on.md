# Single Sign-on (SSO)

Single Sign-on (SSO) allows your team members to authenticate to DVC Studio
using your organization's identity Provider (IDP) such as Okta, LDAP, Microsoft
AD, etc.

SSO for teams can be configured by [team `admins`](#roles), and requires
configuration on both DVC Studio and the IDP. The exact steps for this depend on
the IDP.

Once the SSO configuration is complete, users can login to DVC Studio using
their team's login page at
`http://studio.iterative.ai/api/teams/<TEAM_NAME>/sso`. They can also login
directly from their Okta dashboards by clicking on the DVC Studio integration
icon.

<!-- TODO: Add gif/video -->

If a user does not have a pre-assigned role when they sign in to a team, they
will be auto-assigned the [`Viewer` role](#roles).

## Okta integration

**Configure Okta in DVC Studio team settings**

In in SSO section of your team settings page, provide the following values:

- `signOnUrl`: You can find this value in < >. Example:
  "https://...okta.com/app/dev-..\_studiodevsaml_1/../sso/saml"
- `issuer`: You can find this value in < >. Example: "http://www.okta.com/.."
- `publicCert`: You can find this value in < >. Example: ".."

<!-- TODO: Add screenshot/gif/video -->

**Add integration with DVC Studio in Okta** In Okta, follow
[these steps](https://developer.okta.com/docs/guides/build-sso-integration/saml2/main/#create-your-integration-in-okta).
In short, in the integration set-up page in Okta, provide the following values:

- `SP Entity ID`: "https://studio.iterative.ai/api/saml"
- `Single sign-on URL`:
  "https://studio.iterative.ai/api/teams/<TEAM_NAME>/saml/consume"
- `Name ID Format`: "Persistent"
- `Application username`: "Okta username"
- `Update application username on`: "Create and update"
- `Attribute Statements`: Add mapping of user email as `Name`: "email", `Value`:
  "user.email"

<!-- TODO: Add screenshot/gif/video -->
