# Setup a Google Drive DVC Remote

Follow this guide to setup Google Drive as your <abbr>DVC project</abbr>'s
[remote storage](/doc/command-reference/remote).

## Configure a Google Cloud project

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

> Note that Google Drive API has usage limits/quotas per credentials in a
> _project_ (which you can review in the
> [OAuth consent screen](https://console.developers.google.com/apis/credentials/consent)).
> Please keep this in mind when sharing them, or you may
> [exceed the limits](https://developers.google.com/drive/api/v2/handle-errors?hl=ro#resolve_a_403_error_usage_limit_exceeded).

## URL format for Google Drive remotes

A GDrive DVC remote URLs is needed for the `dvc remote add` command. It can be
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
`https://drive.google.com/drive/folders/0AIac4JZqHhKmUk9PDA`:

```dvc
$ dvc remote add mygdfolder gdrive://0AIac4JZqHhKmUk9PDA
$ dvc remote add mygdsubfolder \
                 gdrive://0AIac4JZqHhKmUk9PDA/sub/path
```

[Shared drives](https://developers.google.com/drive/api/v2/about-shareddrives)
should be referenced by _Folder ID_ in the same way.

3. `appDataFolder` - special
   [application-specific data](https://developers.google.com/drive/api/v2/appdata)
   folder only accessible by your application and hidden from the user.

```dvc
$ dvc remote add mygdappata gdrive://appDataFolder
```

## Configure the GDrive remote

Use the `dvc remote modify` command to set the credentials for each `gdrive://`
remote, for example:

```dvc
$ dvc remote add -d mygdfolder gdrive://root/path/to/folder
$ dvc remote modify mygdfolder gdrive_client_id <client ID>
$ dvc remote modify mygdfolder gdrive_client_secret <client secret>
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
