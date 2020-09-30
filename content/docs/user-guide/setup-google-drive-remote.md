# Setup a Google Drive DVC Remote

In this guide we explain the existing ways to setup Google Drive
[remote storage](/doc/command-reference/remote) for your <abbr>DVC
projects</abbr>, along with the different benefits each one brings.

DVC uses the Google Drive API to synchronize your DVC project data with this
type of remote storage, so it's subject to certain usage limits and quotas,
which by default are shared with other GDrive remote storage users. For heavy
use, it's highly recommended to
[connect using a custom Google Cloud project](#using-a-custom-google-cloud-project),
which puts you in control of these limits.

Having your own GC project, it's also possible to
[use a service account](#using-service-accounts) for automating tasks that need
to establish GDrive remote connections (e.g. CI/CD).

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

    https://accounts.google.com/o/oauth2/auth # ... copy this link

Enter verification code: # <- enter resulting code
```

See [Authorization](#authorization) for more details.

## URL format

There's a few alternatives to construct a GDrive remote URL for different uses,
such as a folder or subfolder in root, shared folders not owned by your account,
etc. The URL is formed with a _base_, and an optional _path_ to an **existing**
folder i.e. `gdrive://<base>/path/to/folder`. The base can be one of:

1. _Folder ID_ (recommended) - unique identifier for every Google Drive folder,
   including [shared folders](https://support.google.com/drive/answer/7166529)
   and [shared drives](https://support.google.com/a/users/answer/9310351)\*
   (these two can only be referenced by ID).

   > ⚠️ The folder in question should be shared to specific users (or groups) so
   > they can use it with DVC. "Anyone with a link" is not guaranteed to work.

   ```dvc
   $ dvc remote add myremote gdrive://0AIac4JZqHhKmUk9PDA
   ```

   or

   ```dvc
   $ dvc remote add myremote \
                         gdrive://0AIac4JZqHhKmUk9PDA/Data/text
   ```

   `0AIac4JZqHhKmUk9PDA` above is the folder ID, and it can be found in the web
   browser address bar, for example
   `https://drive.google.com/drive/folders/0AIac4JZqHhKmUk9PDA`.

   > \* Please note the
   > [Shared drive limits](https://support.google.com/a/answer/7338880) on
   > storage and uploads.

2. `root` - indicates your topmost Google Drive folder ("My Drive").

   ⚠️ Only suitable for personal use, as sharing a remote configured this way
   would cause DVC to try synchronizing data to/from different Google Drives for
   every user.

   ```dvc
   $ dvc remote add myremote gdrive://root/dvcstore
   ```

   > We don't recommend using `gdrive://root` by itself, as it's likely used for
   > many other reasons, and pushing data with DVC here can make it messy.

3. `appDataFolder` -
   [special hidden folder](https://developers.google.com/drive/api/v2/appdata)
   (unique per user) meant to store application-specific data. This is a good
   choice to prevent accidentally deleting remote storage data from the Google
   Drive web UI.

   ⚠️ Only suitable for personal use.

   ```dvc
   $ dvc remote add myremote gdrive://appDataFolder
   ```

## Using a custom Google Cloud project (recommended)

Optionally, follow these steps to create your own Google Cloud project and
generate OAuth credentials for your GDrive remotes to connect to Google Drive.
We highly recommend this for heavy use and advanced needs because:

- You control your Google API usage limits, being able to request Google for an
  increase if needed.
- It ensures optimal data transfer performance when you need it.
- [Using a service account](#using-service-accounts) for automation tasks (e.g.
  CI/CD) is only possible this way.

DVC uses the [Google Drive API](https://developers.google.com/drive) to connect
to your Google Drive. This requires a Google Cloud _project_ that allows Drive
API connections, and its
[OAuth](https://developers.google.com/identity/protocols/OAuth2) credentials
(**client ID** and **client secret**).

1. Sign into the [Google API Console](https://console.developers.google.com).

   > Double check you're using the intended Google account (upper-right corner).

2. Select or
   [Create](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project)
   a project for DVC remote connections.

3. [Enable the Drive API](https://developers.google.com/drive/api/v2/about-sdk)
   from the **APIs & Services** **Dashboard** (left sidebar), click on **+
   ENABLE APIS AND SERVICES**. Find and select the "Google Drive API" in the API
   Library, and click on the **ENABLE** button.

   ![](/img/gdrive-enable-apis-and-services.png)

4. Go back to **APIs & Services** in the left sidebar, and select **OAuth
   consent screen**. Chose a **User Type** and click **CREATE**. On the next
   screen, enter an **Application name** e.g. "DVC remote storage", and click
   the **Save** (scroll to bottom).

5. From the left sidebar, select **Credentials**, and click the **Create
   credentials** dropdown to select **OAuth client ID**. Chose **Desktop app**
   and click **Create** to proceed with a default client name.

   ![](/img/gdrive-create-credentials.png)

6. The newly generated **client ID** and **client secret** should be shown to
   you now, and you can always come back to **Credentials** to fetch them.

✅ It should be safe to share **client ID** and **client secret** among your
team. These credentials are only used to generate the
[authorization](#authorization) URL you'll need to visit later in order to
connect to the Google Drive.

Finally, use the `dvc remote modify` command to set the credentials (for each
GDrive remote), for example:

```dvc
$ dvc remote modify myremote gdrive_client_id <client ID>
$ dvc remote modify myremote gdrive_client_secret <client secret>
```

> Note that Google Drive API usage limits/quotas apply per _project_ client and
> can be reviewed in the
> [OAuth consent screen](https://console.developers.google.com/apis/credentials/consent).
> Please keep this in mind when sharing them, or you may
> [exceed the limits](https://developers.google.com/drive/api/v2/handle-errors?hl=ro#resolve_a_403_error_usage_limit_exceeded).

## Using service accounts

A [service account](https://cloud.google.com/iam/docs/service-accounts) is a
Google account associated with your GCP project, and not a specific user. They
are intended for scenarios where your code needs to access data on its own, e.g.
running inside a Compute Engine, automatic CI/CD, etc. No interactive user OAuth
authentication is needed.

> This requires having your own
> [GC project](/doc/user-guide/setup-google-drive-remote#using-a-custom-google-cloud-project)
> as explained above.

1. To
   [create a service account](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account),
   navigate to **IAM & Admin** in the left sidebar, and select **Service
   Accounts**. Click **+ CREATE SERVICE ACCOUNT**, on the next screen, enter
   **Service account name** e.g. "My DVC project", and click **Create**. Select
   **Continue** at the next **Service account permissions** page, click at **+
   CREATE KEY**, select **P12** and **Create**. Download the generated `.p12`
   key file to a safe location.

   ⚠️ Be careful about sharing the key file with others.

2. Configure the remote to use the service account and tell if where to find the
   key file:

   ```dvc
   $ dvc remote modify myremote gdrive_use_service_account true
   $ dvc remote modify myremote gdrive_service_account_email <service acct email>
   $ dvc remote modify myremote gdrive_service_account_p12_file_path path/to/file.p12
   ```

## Authorization

On the first usage of a GDrive [remote](/doc/command-reference/remote), for
example when trying to `dvc push` tracked data for the first time, DVC will
prompt you to visit a special Google authentication web page. There you'll need
to sign into a Google account with the needed access to the GDrive
[URL](#url-format) in question. The
[auth process](https://developers.google.com/drive/api/v2/about-auth) will ask
you to grant DVC the necessary permissions, and produce a verification code
needed for DVC to complete the connection. On success, the necessary credentials
will be saved in a Git-ignored file, located in
`.dvc/tmp/gdrive-user-credentials.json` and they will be used automatically next
time you run DVC.

⚠️ In order to prevent unauthorized access to your Google Drive, **do not share
these credentials with others**. Each team member should go through this process
individually.

If you use multiple GDrive remotes, by default they will be sharing the same
`.dvc/tmp/gdrive-user-credentials.json` file. It can be overridden with the
`gdrive_user_credentials_file` setting:

```dvc
$ dvc remote modify myremote gdrive_user_credentials_file \
                    .dvc/tmp/myremote-credentials.json
```

⚠️ In order to prevent unauthorized access to your Google Drive, **never
commit** this file with Git. Instead, add it into `.gitignore` and never share
it with other people.

If you wish to change the user you have authenticated with, or for
troubleshooting misc. token errors, simply remove the user credentials JSON file
and authorize again.

Alternatively, a `GDRIVE_CREDENTIALS_DATA` can be set to pass user credentials
in CI/CD systems, production setup, read-only file systems, etc. The content of
this variable should be a string with JSON that has the same format as in the
credentials files described above, and usually you get it going through the same
authentication process. DVC reads this variable first, before the credentials
file.

> Please note our [Privacy Policy (Google APIs)](/doc/user-guide/privacy).
