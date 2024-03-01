# Single Sign-on (SSO)

Single Sign-on (SSO) allows your team members to authenticate to DVC Studio
using your organization's identity Provider (IdP) such as Okta, LDAP, Microsoft
AD, etc.

We support integration with Okta, and instructions are provided below; but other
IdPs should also work in a similar manner. If you need any support setting up
your IdP integration,
[let us know](/doc/studio/user-guide/troubleshooting#support).

SSO for teams can be configured by [team `admins`](#roles), and requires
configuration on both DVC Studio and the IdP. The exact steps for this depend on
the IdP.

Once the SSO configuration is complete users can login to DVC Studio by opening
their team's login page `http://studio.iterative.ai/api/teams/<TEAM_NAME>/sso`
in their browser. They can also login directly from their Okta end-user
dashboards by clicking on the DVC Studio integration icon.

If a user does not have a pre-assigned role when they sign in to a team, they
will be auto-assigned the [`Viewer` role](#roles).

## Okta integration

1. **Create Enterprise account**: SSO is available for DVC Studio teams with
   enterprise account subscriptions. If you are on the Free or Basic plan of DVC
   Studio,
   [contact us to upgrade your account](https://schedule.iterative.ai/studio-upgrade).

2. **Add integration with DVC Studio in Okta**: Follow the instructions from the
   [Okta developer guide](https://developer.okta.com/docs/guides/build-sso-integration/saml2/main/#create-your-integration-in-okta).
   In short, login to Okta with an admin account, and follow these steps:

   1. In the admin console, go to `Applications` -> `Create App Integration` to
      create a private SSO integration.
   2. Use `SAML 2.0` as the `Sign in method` (and not `OIDC` or some other
      option).
   3. Enter any name (eg, `DVC Studio`) as the `App name`.
   4. `Single sign-on URL`:
      [https://studio.iterative.ai/api/teams/<TEAM_NAME>/saml/consume](https://studio.iterative.ai/api/teams/<TEAM_NAME>/saml/consume)
      (Replace <TEAM_NAME> with the name of your team in Studio.
   5. `Audience URI (SP Entity ID)`: https://studio.iterative.ai/api/saml
   6. `Name ID Format`: Persistent
   7. `Application username (NameID)`: Okta username
   8. `Attribute Statements (optional)`: 1. `Name`: email 2. `Name format`: URI
      Reference 3. `Value`: user.email

   ![](https://static.iterative.ai/img/studio/sso_okta_configure_saml.png)

   8. Click on `Next` and `Finish`.
   9. Once the integration is created, open the `Sign On` tab and expand the
      `Hide Details` section. From here, copy the `Sign on URL`, `Issuer` and
      `Signing Certificate`.

   ![](https://static.iterative.ai/img/studio/sso_okta_sign_on_details.png)

3. **Configure Okta in DVC Studio team settings**: Back in Studio, open your
   enterprise team's `Settings` page. Go to the `SAML Single Sign-on` section
   and enable SAML Authentication.

   ![](https://static.iterative.ai/img/studio/sso_enable_saml_authentication.png)

   Then, fill in the required details:

   1. `Sign-on URL`: Paste the `Sign on URL` you copied from Okta
   2. `Identity Provider Issuer URL`: Paste the `Issuer` you copied from Okta
   3. `Public Certificate`: Paste the `Signing Certificate` you copied from
      Okta. Or, you can `Download` the `Signing Certificate` from Okta, open the
      downloaded file with a text editor, and copy the value from here.

      ![](https://static.iterative.ai/img/studio/sso_public_certificate.png)

      Then, click on `Save`. DVC Studio will generate the `SSO login URL` and
      the `assertion consumer service URL` for your team and display their
      values to use just below the `Save` button.

4. **Assign users**: Now, whenever you need to authorize users to access your
   DVC Studio team, you should assign these users to the application that you
   have configured. For this, open Okta and follow these steps:

   1. Open `Applications`
   2. Click on `Assign Users to App`
   3. Select your app, and select all the users you want to assign.
   4. Click on `Next` and `Confirm Assignments`.

   <admon>

   The Single Sign-on URL for your team is
   [https://studio.iterative.ai/api/teams/<TEAM_NAME>/sso](https://studio.iterative.ai/api/teams/<TEAM_NAME>/saml/consume).
   Users that you assign to your team can login to DVC Studio by opening the
   Single Sign-on URL and providing their Okta login credentials.

   </admon>

   <admon>

   If a user does not have a pre-assigned role when they sign in to a team, they
   will be auto-assigned the `Viewer` role. If the role needs to be changed, it
   has to be done in the `Collaborators` page in the DVC Studio team settings.

   </admon>
