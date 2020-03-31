# Setup a Google Drive DVC Remote

Follow this guide to setup Google Drive as your <abbr>DVC project</abbr>'s
[remote storage](/doc/command-reference/remote).

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

Note that
[Shared drives](https://developers.google.com/drive/api/v2/about-shareddrives)
can only be referenced by _Folder ID_.

3. `appDataFolder` - special
   [application-specific data](https://developers.google.com/drive/api/v2/appdata)
   folder only accessible by your application and hidden from the user.

```dvc
$ dvc remote add mygdappata gdrive://appDataFolder
```

## Configure a Google Cloud project (highly recommended)

Optionally, follow this guide to setup your own Google Cloud project and OAuth
credentials. Doing so avoids sharing the default DVC project with every other
user without a dedicated project. Having your own gives you full control over
Google API usage and rate limits, and ensures optimal performance to access your
GDrive remote.

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

## Access Google Drive remote with OAuth credentials

Use the `dvc remote modify` command to set the credentials for each `gdrive://`
remote, for example:

```dvc
$ dvc remote add -d mygdfolder gdrive://root/path/to/folder
$ dvc remote modify mygdfolder gdrive_client_id <client ID>
$ dvc remote modify mygdfolder gdrive_client_secret <client secret>
```

## Access Google Drive remote with a service account

A
[service account](https://cloud.google.com/iam/docs/understanding-service-accounts)
can be used to configure the GDrive remote.

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

On the first usage of a GDrive [DVC remote](/doc/command-reference/remote),
you'll be prompted to visit a web page to generate an access token, which will
require you to sign into the corresponding Google account. The
[sign-in process](https://developers.google.com/drive/api/v2/about-auth) will
guide you through granting the necessary access permissions. On success, the
token data will be cached in a Git-ignored directory located in
`.dvc/tmp/gdrive-user-credentials.json`.

⚠️ In order to prevent unauthorized access to your Google Drive, **do not share
access token data with others**. Each team member should generate their own
tokens.

> Please note our [Privacy Policy (Google APIs)](/doc/user-guide/privacy).
