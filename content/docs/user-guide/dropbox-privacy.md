# Privacy Policy for Access to Dropbox API

DVC is using the [Dropbox API](https://www.dropbox.com/developers) to make it
easier to store files on Dropbox. For more details on how to set it up, refer to
[Setup a Dropbox DVC Remote](/doc/user-guide/setup-dropbox-remote).

DVC uses the _DVC_ Application on Dropbox. (That is the name you will see in a
consent screen.) This integration is governed by common policies, recorded here.

Your use of Dropbox API with DVC is subject to each API’s respective terms of
service. See [Dropbox Terms of Service](https://www.dropbox.com/terms) and
[Dropbox Privacy Regulations](https://www.dropbox.com/privacy).

## Accessing user data

DVC accesses Dropbox resources from the machine where you use DVC. Your machine
communicates directly with the Dropbox API.

The _DVC_ Application never receives your data or the permission to access your
data. The owners of the project can only see anonymous, aggregated information
about usage of tokens obtained through its OAuth client, such as which APIs and
endpoints are being used.

DVC sends users to `https://www.dropbox.com/oauth2/authorize` for authorization
and does not directly access or collect user data used by Dropbox Auth.

## Using user data

DVC includes functions that you can execute in order to read or modify your own
data (or data shared with you). This can only happen after you provide a token,
which requires that you authenticate yourself as a specific Dropbox user and
authorize these actions.

DVC can help you get a token by guiding you through the OAuth flow in the
browser. There you must consent to allow the _DVC_ Application to operate on
your behalf. The OAuth consent screen will describe the scope of what is being
authorized e.g. it will name the target API(s) and whether you are authorizing
“read only” or “read and write” access.

## Scopes

DVC uses the `Scoped App (App Folder)` permission type. Therefore its access is
limited to the `DROPBOX_HOME/Applications/dvc` directory. There, the following
scopes are enabled:

- `account_info.read` - View basic information about your Dropbox account such
  as your username, email, and country
- `files.metadata.write` - View and edit information about your Dropbox files
  and folders
- `files.metadata.read` - View information about your Dropbox files and folders
- `files.content.write` - Edit content of your Dropbox files and folders
- `files.content.read` - View content of your Dropbox files and folders

## Sharing user data

DVC only communicates with Dropbox API. No user data is shared with the owners
of the _DVC_ Dropbox Project, DVC, Iterative or any other party.

## Storing user data

DVC stores your credentials on your machine, for later reuse by you. **Use
caution when using Dropbox DVC remotes on shared machines.**

By default, OAuth tokens are cached in a local file per DVC repository, located
in `.dvc/tmp/dropbox-user-credentials.json`.

## Usage in other packages or applications

Do not use an API key or client ID from the _DVC_ Application in an external
package or tool. Per the
[Dropbox Accceptable Usse](https://www.dropbox.com/acceptable_use), your
application must accurately represent itself when authenticating to Dropbox API
services.

If you use DVC inside another package or application that executes its own logic
— as opposed to code in DVC or by the user — you must communicate this clearly
to the user. Do not use credentials from the _DVC_ Application; instead, use
credentials associated with your project or user.
