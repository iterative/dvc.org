# Setup a Dropbox DVC Remote

In this guide we explain the existing ways to setup Dropbox
[remote storage](/doc/command-reference/remote) for your <abbr>DVC
projects</abbr>, along with the different benefits each one brings.

## Quick start

To start using a Dropbox remote, you only need to add it with a
[valid URL format](#url-format). Then use any DVC command that needs to connect
to it (e.g. `dvc pull` or `dvc push` once there's tracked data to synchronize).
For example:

```dvc
$ dvc add data
...
$ dvc remote add --default myremote \
                           dropbox://my-directory
$ dvc push

Go to the following link in your browser:

    https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=<client-id>&token_access_type=offline # ... copy this link

Enter verification code: # <- enter resulting code
```

See [Authorization](#authorization) for more details.

## URL format

You can indicate any directory name that will be created under the
`DROPBOX_HOME`, e.g. `DROPBOX_HOME/dvc/my-project`. Make sure this name is not
already used for another project to keep things separated. The URL is formed as
follows: `dropbox://dvc/my-project`. It does not need to be an existing
directory.

## Authorization

On the first usage of a Dropbox [remote](/doc/command-reference/remote), for
example when trying to `dvc push` tracked data for the first time, DVC will
prompt you to visit a special Dropbox authentication web page. There you'll need
to sign into a Drobpox account with the needed access to the Dropbox
[URL](#url-format) in question. The
[auth process](https://www.dropbox.com/lp/developers/reference/oauth-guide) will
ask you to grant DVC the necessary permissions, and produce a verification code
needed for DVC to complete the connection. On success, the necessary credentials
will be saved in a Git-ignored file, located in
`.dvc/tmp/dropbox-user-credentials.json` and they will be used automatically
next time you run DVC.

⚠️ In order to prevent unauthorized access to your Dropbox, **do not share these
credentials with others**. Each team member should go through this process
individually.

If you use multiple Dropbox remotes, by default they will be sharing the same
`.dvc/tmp/dropbox-user-credentials.json` file. It can be overridden with the
`DROPBOX_CREDENTIALS_FILE` environment variable:

```dvc
$ export DROPBOX_CREDENTIALS_FILE=.dvc/tmp/myremote-credentials.json
```

⚠️ In order to prevent unauthorized access to your Dropbox, **never commit**
this file with Git. Instead, add it into `.gitignore` and never share it with
other people.

If you wish to change the user you have authenticated with, or for
troubleshooting misc. token errors, simply remove the user credentials JSON file
and authorize again.

Alternatively, a set of environment variables can be set to pass user
credentials in CI/CD systems, production setup, read-only file systems, etc. DVC
reads these variables first, before the credentials file:

- `DROPBOX_ACCESS_TOKEN` - current access token
- `DROPBOX_EXPIRES_AT` - access token expiration time in ISO format
- `DROPBOX_REFRESH_TOKEN` - refresh token for reauthentication

> Please note our
> [Privacy Policy (Dropbox API)](/doc/user-guide/dropbox-privacy).

## Selective Sync

If you synchronize your Dropbox account to your computer, you may not
necessarily want to synchronize all the files DVC uses. Instead, you can setup
Selective Sync or Smart Sync within the Dropbox desktop application.

### Selective Sync vs Smart Sync

The two options differ slightly:

| Characteristic                           | Selective Sync | Smart Sync |
| ---------------------------------------- | -------------- | ---------- |
| DVC files downloaded locally             | No             | No         |
| DVC files metadata downloaded locally    | No             | Yes        |
| New file notifications (in desktop app)  | No             | Yes        |
| Files visible in Explorer / Finder / ... | No             | Yes        |
| Files visible in Dropbox web UI          | Yes            | Yes        |

If you plan to use DVC with few (say up to 100 files) of significant size, it
should not matter whether you use Selective Sync or Smart Sync.

If you plan to use DVC with numerous small files (like thousands of images),
metadata synchronization becomes significant issue. Therefore, it's recommended
to use Selective Sync and disable synchronization of the DVC storage directory.
This works well with remote machines being used for computations and your
computer just for coding.

If you already used a directory on your Dropbox as a 'local cache' which just
got synchronized via Dropbox, you probably review most of the files locally. In
such case Smart Sync would be more useful than duplicating the storage. However,
care must be taken to ensure that the synchronization completes on the Dropbox
side.

You can use different settings for different projects. Selective Sync could be
enabled for a project with numerous images, while the project with big models
and big binary data files can be under Smart Sync at the same time.

### Enable Selective Sync / Smart Sync

1. Open Dropbox app preferences.
2. Navigate to the **Sync** tab.
3. **Choose folders** for Selective Sync.

   ![](/img/dropbox-selective-sync.png)

4. Turn on **Save hard drive space automatically** for Smart Sync.

You can read more in the
[Dropbox Help Center](https://help.dropbox.com/installs-integrations/sync-uploads/selective-sync-overview).
