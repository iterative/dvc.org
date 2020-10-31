# Setup a Dropbox DVC Remote

In this guide we explain the existing ways to setup Dropbox
[remote storage](/doc/command-reference/remote) for your <abbr>DVC
projects</abbr>, along with the different benefits each one brings.

## Quick start

To start using a Google Drive remote, you only need to add it with a
[valid URL format](#url-format). Then use any DVC command that needs to connect
to it (e.g. `dvc pull` or `dvc push` once there's tracked data to synchronize).
For example:

```dvc
$ dvc add data
...
$ dvc remote add --default myremote \
                           gdrive://0AIac4JZqHhKmUk9PDA/dvcstore
$ dvc push

Go to the following link in your browser:

    https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=<client-id>&token_access_type=offline # ... copy this link

Enter verification code: # <- enter resulting code
```

See [Authorization](#authorization) for more details.

## URL format

You can indicate any directory name that will be created under the
`DROPBOX_HOME/Applications/dvc`, e.g. `DROPBOX_HOME/Applications/dvc/my-project`.
Make sure this name is not already used for another project to keep things
separated. The URL is formed as follows: `dropbox://my-project`. It does not
need to be an existing directory.

## Authorization

On the first usage of a Dropbox [remote](/doc/command-reference/remote), for
example when trying to `dvc push` tracked data for the first time, DVC will
prompt you to visit a special Dropbox authentication web page. There you'll need
to sign into a Drobpox account with the needed access to the Dropbox
[URL](#url-format) in question. The
[auth process](https://www.dropbox.com/lp/developers/reference/oauth-guide) will ask
you to grant DVC the necessary permissions, and produce a verification code
needed for DVC to complete the connection. On success, the necessary credentials
will be saved in a Git-ignored file, located in
`.dvc/tmp/dropbox-user-credentials.json` and they will be used automatically next
time you run DVC.

⚠️ In order to prevent unauthorized access to your Dropbox, **do not share
these credentials with others**. Each team member should go through this process
individually.

If you use multiple Dropbox remotes, by default they will be sharing the same
`.dvc/tmp/dropbox-user-credentials.json` file. It can be overridden with the
`DROPBOX_CREDENTIALS_FILE` environment variable:

```dvc
$ export DROPBOX_CREDENTIALS_FILE=.dvc/tmp/myremote-credentials.json
```

⚠️ In order to prevent unauthorized access to your Dropbox, **never
commit** this file with Git. Instead, add it into `.gitignore` and never share
it with other people.

If you wish to change the user you have authenticated with, or for
troubleshooting misc. token errors, simply remove the user credentials JSON file
and authorize again.

Alternatively, a set of environment variables can be set:

- `DROPBOX_ACCESS_TOKEN` - current access token
- `DROPBOX_EXPIRES_AT` - access token expiration time in ISO format
- `DROPBOX_REFRESH_TOKEN` - refresh token for reauthentication

to pass user credentials in CI/CD systems, production setup, read-only file systems,
etc. DVC reads these variable first, before the credentials file.

> Please note our [Privacy Policy (Dropbox API)](/doc/user-guide/dropbox-privacy).
