# Privacy Policy for Access to Google APIs

DVC is using the [Google Drive API](https://developers.google.com/drive/) to
make it easier to store files on Google Drive. For more details on how to set it
up, refer to
[Setup a Google Drive DVC Remote](/doc/user-guide/setup-google-drive-remote).

DVC uses the _DVC_ Application on Google Cloud Platform. (That is the name you
will see in a consent screen.) This integration is governed by common policies,
recorded here.

Your use of Google APIs with DVC is subject to each API’s respective terms of
service. See
[Google APIs Terms of Service](https://developers.google.com/terms/).

## Accessing user data

DVC accesses Google resources from the machine where you use DVC. Your machine
communicates directly with the Google APIs.

The _DVC_ Application never receives your data or the permission to access your
data. The owners of the project can only see anonymous, aggregated information
about usage of tokens obtained through its OAuth client, such as which APIs and
endpoints are being used.

DVC sends users to `https://accounts.google.com/o/oauth2/auth` for authorization
and does not directly access or collect user data used by Google Auth.

## Using user data

DVC includes functions that you can execute in order to read or modify your own
data (or data shared with you). This can only happen after you provide a token,
which requires that you authenticate yourself as a specific Google user and
authorize these actions.

DVC can help you get a token by guiding you through the OAuth flow in the
browser. There you must consent to allow the _DVC_ Application to operate on
your behalf. The OAuth consent screen will describe the scope of what is being
authorized e.g. it will name the target API(s) and whether you are authorizing
“read only” or “read and write” access.

There are two ways to use DVC with Google Drive without authorizing the _DVC_
Application: bring your own service account token or configure the package to
use an OAuth client of your choice. See
[Setup a Google Drive DVC Remote](/doc/user-guide/setup-google-drive-remote) for
more information.

## Scopes

`userinfo.email` scope (view your email address)' `userinfo.profile` scope (see
your personal info. including any personal info you've made publicly available),
and `openid` scope (authenticate using OpenID Connect) are required to be used
by Google Auth.

DVC allows you to manage your Google Drive files and therefore the default
scopes also include `drive` (read/write access to your Google Drive) and
`drive.appdata` (manage configuration folder in your Google Drive).

## Sharing user data

DVC only communicates with Google APIs. No user data is shared with the owners
of the _DVC_ GCP Project, DVC, Iterative or any other party.

## Storing user data

DVC stores your credentials on your machine, for later reuse by you. **Use
caution when using Google Drive DVC remotes on shared machines.**

By default, OAuth tokens are cached in a local file per DVC repository, located
in `.dvc/tmp/gdrive-user-credentials.json`.

## Usage in other packages or applications

Do not use an API key or client ID from the _DVC_ Application in an external
package or tool. Per the
[Google User Data Policy](https://developers.google.com/terms/api-services-user-data-policy),
your application must accurately represent itself when authenticating to Google
API services.

If you use DVC inside another package or application that executes its own logic
— as opposed to code in DVC or by the user — you must communicate this clearly
to the user. Do not use credentials from the _DVC_ Application; instead, use
credentials associated with your project or user.

## Acknowledgments

This document is based on Tidyverse's
[Privacy policy for packages that access Google APIs](https://www.tidyverse.org/google_privacy_policy/).
