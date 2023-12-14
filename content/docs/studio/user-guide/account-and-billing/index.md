# Account Management

To open your account settings, click on your user icon on the top right corner
of DVC Studio, and go to your `Profile`. You can view and update the following
settings:

- [Personal details](#personal-details), including name, username and email
  addresses
- [Security details](#security-details), including password, access token, and
  cloud credentials
- [Git integrations](#git-integrations) with GitHub, GitLab and Bitbucket

<admon>

This does not include managing your team plan (Free, Basic, or Enterprise). Team
plans are defined for each team separately. To manage them, go to the [team
settings] page and scroll to the `Plan and billing` section. You can change
plans there and increase or decrease the number of seats in it.

[team settings]: /doc/studio/user-guide/team-collaboration/teams#settings

</admon>

## Personal details

In your profile page, the topmost section includes your first name, last name
and profile picture. If you signed up with a GitHub, GitLab or Bitbucket
account, these details are fetched from your connected Git hosting account.

Your username is displayed next. This is also fetched from your connected Git
hosting account if you signed up with a GitHub, GitLab or Bitbucket account.

You can edit your name as well as username.

### Managing email addresses

You can add multiple email addresses to a single DVC Studio account. You can
login to the account with any of your verified email addresses as long as you
have set up a password for your account. This is true even if you signed up
using your GitHub, GitLab, or Bitbucket.

One of your email addresses must be designated as primary. This is the address
to which DVC Studio will send all your account notification emails.

You can change your primary email address by clicking on the `Primary` button
next to the email address which you want to designate as primary.

You can delete your non-primary email addresses.

## Security details

Your password can be changed or reset from the `Account` section in your profile
page.

### Studio access token

DVC Studio uses access tokens to authorize [DVC] and [DVCLive] to send
experiment updates, and to authenticate you in the DVC Studio
[REST API](/doc/studio/rest-api).

In the `Studio access token` section of your [Profile] page, you can generate a
new token as well as regenerate (replace) or delete your access token.

The option to delete the access token is also available when you change your
password, so that you can reset all your access credentials at once. This is
handy if you suspect that your account security may have been compromised.

### Client access tokens

In the `Studio access token` section of your [Profile] page, you can generate
new client access tokens with specific scopes as well as delete existing access
tokens. These tokens can be used to give limited permissions to a client without
granting full access to your Studio account.

The available scopes are:

- `Experiment operations` - DVC uses this to share <abbr>experiments</abbr>.
- `Model Registry operations` - <abbr>Model registry</abbr> operations like
  downloading models.
- `Dataset operations` - [Coming soon](https://cloud.dvc.ai).

### Cloud credentials

In the `Cloud Credentials` section of your [Profile] page, you can view, add and
update credentials for cloud resources. These credentials are used to
[fetch project data from data remotes](/doc/studio/user-guide/experiments/configure-a-project#data-remotes--cloud-storage-credentials).

To add new credentials, click `Add credentials` and select the cloud provider.
Depending on the provider, you will be asked for more details.

![](https://static.iterative.ai/img/studio/s3_remote_settings_v2.png)

The credentials must have the required permissions. For
[data remotes](/doc/studio/user-guide/experiments/configure-a-project#data-remotes--cloud-storage-credentials),
you can find more details about required permissions [here][data remote].

[data remote]: /doc/user-guide/data-management/remote-storage
[profile]: https://studio.iterative.ai/user/_/profile

Finally, click `Save credentials`.

## Git integrations

In this section, you can,

- Connect to GitHub.com, GitLab.com or Bitbucket.org.

  When you connect to a Git hosting provider, you will be prompted to grant DVC
  Studio access to your account.

  To connect to your GitHub repositories, you must install the DVC Studio GitHub
  app. Refer to the section on
  [GitHub app installation](/doc/studio/user-guide/git-integrations/github-app)
  for more details.

  Note that if you signed up to use DVC Studio using your GitHub, GitLb or
  Bitbucket account, integration with that Git account will have been created
  during sign up.

  Also, note that **connections to self-hosted GitLab servers** are not managed
  in this section. If you want to connect to a self-hosted GitLab server, you
  should create a team and
  [set up the GitLab server connection](/doc/studio/user-guide/git-integrations/custom-gitlab-server)
  in the [team settings].

- Disconnect from your GitHub, GitLab, or Bitbucket accounts.
- Configure your GitHub account connection. That is, install the DVC Studio
  GitHub app on additional organizations or repositories, or even remove the app
  from organizations or repositories where you no longer need it.

## Delete account

If you delete your account, all the projects you own and the links that you have
shared will be permanently deleted. So, click on `Delete my account` only if you
are absolutely sure that you do not need those projects or links anymore.

<admon>

Deleting your account in DVC Studio does not delete your Git repositories.

</admon>

[dvc]: /doc
[dvclive]: /doc/dvclive
