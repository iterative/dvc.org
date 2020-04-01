# Setup a Google Drive DVC Remote

In this guide we explain the existing ways to setup Google Drive
[remote storage](/doc/command-reference/remote) for your <abbr>DVC
projects</abbr>, along with the different benefits each one brings.

Note that to start using a GDrive remote, you only need to add it with a valid
URL (see next section), and use any DVC command that requires it (see
`dvc pull`, `dvc fetch`, `dvc push`). For example:

```dvc
$ dvc remote add -d myremote gdrive://root/dvc/dvcstore
$ dvc add file.dat
$ dvc push -r myremote
...
Go to the following link in your browser:

    https://accounts.google.com/o/oauth2/auth # ... copy this link

Enter verification code: # <- enter resulting token
```

See the [Authorization](#authorization) section for more details.

## URL format for Google Drive remotes

A GDrive remote URLs is needed for the `dvc remote add` command. It can be
constructed with a _base_, and an **optional** _path_ to a folder i.e.
`gdrive://<base>/path/to/folder`. The base can be one of:

1. `root` - indicates your topmost Google Drive directory.

```dvc
$ dvc remote add -d mygdroot gdrive://root
$ dvc remote add mygdfolder gdrive://root/path/to/folder
```

2. Google Drive _Folder ID_

To obtain the unique _Folder ID_ in question, navigate into that folder in your
web browser, and find it in the address bar. For example, for
`https://drive.google.com/drive/u/0/folders/0AIac4JZqHhKmUk9PDA`:

```dvc
$ dvc remote add mygdfolder gdrive://0AIac4JZqHhKmUk9PDA
$ dvc remote add mygdsubfolder \
                 gdrive://0AIac4JZqHhKmUk9PDA/sub/path
```

Note that [shared folders](https://support.google.com/drive/answer/7166529) and
[shared drives](https://support.google.com/a/users/answer/9310351) can only be
referenced by _Folder ID_.

3. `appDataFolder` -
   [special hidden folder](https://developers.google.com/drive/api/v2/appdata)
   (unique per user) meant to store application-specific data. This is a good
   choice to prevent accidentally deleting remote storage data from the Google
   Drive web UI.

```dvc
$ dvc remote add mygdappata gdrive://appDataFolder
```

## Configure custom Google Cloud project & app (recommended)

Optionally, follow this guide to setup your own Google Cloud project and
generate OAuth credentials for your <abbr>DVC projects<abbr> to connect to
Google Drive. We highly recommend this for heavy and advanced use because:

- you control your Google API usage and rate limits, being able to request an
  increase to Google if needed.
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

> Note that the Google Drive API has usage limits/quotas per _project_ client
> (which you can review in the
> [OAuth consent screen](https://console.developers.google.com/apis/credentials/consent)).
> Please keep this in mind when sharing them, or you may
> [exceed the limits](https://developers.google.com/drive/api/v2/handle-errors?hl=ro#resolve_a_403_error_usage_limit_exceeded).

### Enabling your GC project with OAuth credentials

Use the `dvc remote modify` command to set the credentials for each `gdrive://`
remote, for example:

```dvc
$ dvc remote add -d mygdfolder gdrive://root/path/to/folder
$ dvc remote modify mygdfolder gdrive_client_id <client ID>
$ dvc remote modify mygdfolder gdrive_client_secret <client secret>
```

## Using service accounts

A [service account](https://cloud.google.com/iam/docs/service-accounts) is a
Google account associated with your GCP project, and not a specific user. They
are intended for scenarios where your application needs to access data on its
own, e.g. running inside a Compute Engine, automatic CI/CD, etc. No interactive
user OAuth authentication is needed.

> This requires having your own
> [GC project](/doc/user-guide/setup-google-drive-remote#configure-custom-google-cloud-project--app-recommended)
> as explained above.

1. [Create a service account](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account),
   navigate to **IAM & Admin** in the left sidebar, and select **Service
   Accounts**. Click **+ CREATE SERVICE ACCOUNT**, on the next screen, enter
   **Service account name** e.g. "My DVC project", and click **Create**. Select
   **Continue** at the next **Service account permissions** page, click at **+
   CREATE KEY**, select **P12** and **Create**. Save generated `.p12` key file
   at your local disk.

1. Copy a downloaded `.p12` file to your DVC project root directory.

```dvc
$ dvc remote modify myremote gdrive_use_service_account True
$ dvc remote modify myremote gdrive_service_account_email <service acct email>
$ dvc remote modify myremote gdrive_service_account_p12_file_path path/to/file.p12
```

## Authorization

On the first usage of a GDrive [remote](/doc/command-reference/remote), for
example when trying to `dvc push` for the first time after adding a GDrive
remote, DVC will prompt you to visit a special Google authorization web page to
generate. This will require you to sign into the corresponding Google account.
Google's [auth process](https://developers.google.com/drive/api/v2/about-auth)
will ask you to grant DVC the necessary access permissions, and produce a token.
On success, the token data will be cached in a Git-ignored directory located in
`.dvc/tmp/gdrive-user-credentials.json`.

⚠️ In order to prevent unauthorized access to your Google Drive, **do not share
access token data with others**. Each team member should generate their own
tokens.

> Please note our [Privacy Policy (Google APIs)](/doc/user-guide/privacy).
