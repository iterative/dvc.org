# Setup a Google Drive DVC Remote

In this guide we explain the existing ways to setup Google Drive
[remote storage](/doc/command-reference/remote) for your <abbr>DVC
projects</abbr>, along with the different benefits each one brings.

Note that to start using a GDrive remote, you only need to add it with a
[valid URL format](#url-format-to-specify-folder-location). Then use any DVC
command that needs it (e.g. `dvc pull`, `dvc fetch`, `dvc push`). For example:

```dvc
$ dvc remote add -d gdremote gdrive://0AIac4JZqHhKmUk9PDA/dvcstore
$ dvc push

Go to the following link in your browser:

    https://accounts.google.com/o/oauth2/auth # ... copy this link

Enter verification code: # <- enter resulting code
```

See the [Authorization](#authorization) section for more details on connecting
DVC with Google Drive.

DVC uses the Google Drive API to synchronize your <abbr>DVC project</abbr> data
with this type of remote storage, so it's subject to certain usage limits and
quotas, which by default are shared with other GDrive remote storage users. For
heavy use, it's highly recommended to
[connect using a custom Google Cloud project](#connect-using-a-custom-google-cloud-project),
which puts you in control of these limits.

Having your own GC project, it's also possible to
[use a service account](#using-service-accounts) for automating tasks that need
to establish GDrive remote connections (e.g. CI/CD).

## URL formats to specify folder location

There's a few alternatives to construct a GDrive remote URL for different uses,
such as a folder or subfolder in root, shared folders not owned by your account,
etc. The URL is formed with a _base_, and an optional _path_ to an **existing**
folder i.e. `gdrive://<base>/path/to/folder`. The base can be one of:

1. _Folder ID_ - unique identifier for each Google Drive folder

   To obtain it, navigate to that folder in your web browser, and find it in the
   address bar. For example, for
   `https://drive.google.com/drive/folders/0AIac4JZqHhKmUk9PDA`:

   ```dvc
   $ dvc remote add gdfolder gdrive://0AIac4JZqHhKmUk9PDA
   $ dvc remote add gdsubfolder \
                  gdrive://0AIac4JZqHhKmUk9PDA/Data/text
   ```

   Note that [shared folders](https://support.google.com/drive/answer/7166529)
   and [shared drives](https://support.google.com/a/users/answer/9310351) can
   only be referenced this way.

2. `root` - indicates your topmost Google Drive directory.

   ⚠️ Only suitable for personal use, as sharing a remote configured this way
   would cause DVC to try synchronizing data to/from different Google Drives for
   every user.

   ```dvc
   $ dvc remote add mygdfolder gdrive://root/dvcstore
   ```

   > Although valid, we don't recommend using just `gdrive://root`, as it's not
   > possible for more than one Google account to access a GDrive root ("My
   > Drive").

3. `appDataFolder` -
   [special hidden folder](https://developers.google.com/drive/api/v2/appdata)
   (unique per user) meant to store application-specific data. This is a good
   choice to prevent accidentally deleting remote storage data from the Google
   Drive web UI.

   ```dvc
   $ dvc remote add gdappata gdrive://appDataFolder
   ```

## Authorization

On the first usage of a GDrive [remote](/doc/command-reference/remote), for
example when trying to `dvc push` for the first time after adding the remote
with a [valid URL](#url-format-to-specify-folder-location), DVC will prompt you
to visit a special Google authorization web page. There you'll need to sign into
your Google account. The
[auth process](https://developers.google.com/drive/api/v2/about-auth) will ask
you to grant DVC the necessary permissions, and produce a verification code
needed for DVC to complete the connection. On success, this code will be cached
in a Git-ignored directory located in `.dvc/tmp/gdrive-user-credentials.json`.

⚠️ In order to prevent unauthorized access to your Google Drive, **do not share
your verification code with others**. Each team member should go through this
process individually.

If you wish to change the user you have authenticated with, or for
troubleshooting misc. token errors, simply remove the user credentials JSON file
and authorize again.

> Please note our [Privacy Policy (Google APIs)](/doc/user-guide/privacy).

## Connect using a custom Google Cloud project (recommended)

Optionally, follow this guide to create your own Google Cloud project and
generate OAuth credentials for your <abbr>DVC projects</abbr> to connect to
Google Drive. We highly recommend this for heavy use and advanced needs because:

- you control your Google API usage limits, being able to request Google for an
  increase if needed.
- it ensures optimal data transfer performance when you need it.
- [using a service account](#using-service-accounts) for automation tasks (e.g.
  CI/CD) is only possible this way.

> Please jump to [Authorization](#authorization) to skip this setup.

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
   credentials** dropdown to select **OAuth client ID**. Chose **Other** and
   click **Create** to proceed with a default client name.

   ![](/img/gdrive-create-credentials.png)

6. The newly generated **client ID** and **client secret** should be shown to
   you now, and you can always come back to **Credentials** to fetch them.

⚠️ It should be safe to share **client ID** and **client secret** among your
team. These credentials are only used to generate the
[authorization](#authorization) URL DVC will later prompt to visit in order to
connect to the Google Drive.

Finally, use the `dvc remote modify` command to set the credentials (for each
GDrive remote), for example:

```dvc
$ dvc remote add gdfolder gdrive://0AIac4JZqHhKmUk9PDA
$ dvc remote modify gdfolder gdrive_client_id <client ID>
$ dvc remote modify gdfolder gdrive_client_secret <client secret>
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
> [GC project](/doc/user-guide/setup-google-drive-remote#connect-using-a-custom-google-cloud-project)
> as explained above.

1. To
   [create a service account](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account),
   navigate to **IAM & Admin** in the left sidebar, and select **Service
   Accounts**. Click **+ CREATE SERVICE ACCOUNT**, on the next screen, enter
   **Service account name** e.g. "My DVC project", and click **Create**. Select
   **Continue** at the next **Service account permissions** page, click at **+
   CREATE KEY**, select **P12** and **Create**. Save generated `.p12` key file
   at your local disk.

1. Copy a downloaded `.p12` file to your DVC project root directory.

```dvc
$ dvc remote modify gdremote gdrive_use_service_account True
$ dvc remote modify gdremote gdrive_service_account_email <service acct email>
$ dvc remote modify gdremote gdrive_service_account_p12_file_path path/to/file.p12
```
