# Google Cloud Storage

<!--
## Google Cloud Storage
-->

Start with `dvc remote add` to define the remote. Set a name and a valid [Google
Cloud Storage] URL:

```cli
$ dvc remote add -d myremote gs://<mybucket>/<path>
```

- `<mybucket>` - name of an [existing storage bucket]
- `<path>` - optional path to a [folder] in your bucket

Upon `dvc push` (or when needed), DVC will try to authenticate using your
[gcloud CLI authorization]. This reads the default GCP key file.

<admon type="warn">

Make sure to run [gcloud auth application-default login] unless you use a
service account or other ways to authenticate ([more info]).

</admon>

[google cloud storage]: https://cloud.google.com/storage
[existing storage bucket]:
  https://cloud.google.com/storage/docs/creating-buckets
[folder]: https://cloud.google.com/storage/docs/folders
[gcloud cli authorization]: https://cloud.google.com/sdk/docs/authorizing
[gcloud auth application-default login]:
  https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login
[more info]: https://stackoverflow.com/a/53307505/298182

To use [custom auth](#custom-authentication) or further configure your DVC
remote, set any supported config param with `dvc remote modify`.

## Cloud versioning

<admon type="info">

Requires [Object versioning] enabled on the bucket.

</admon>

```cli
$ dvc remote modify myremote version_aware true
```

`version_aware` (`true` or `false`) enables [cloud versioning] features for this
remote. This lets you explore the bucket files under the same structure you see
in your project directory locally.

[object versioning]: https://cloud.google.com/storage/docs/object-versioning
[cloud versioning]: /docs/user-guide/data-management/cloud-versioning

## Custom authentication

For [service accounts] (a Google account associated to your GCP project instead
of a user), you can set the path to the file that contains a [service account
key]:

[service accounts]: https://cloud.google.com/iam/docs/service-accounts
[service account key]:
  https://cloud.google.com/iam/docs/creating-managing-service-account-keys

```cli
$ dvc remote modify --local myremote \
                    credentialpath 'path/to/project-XXX.json'
```

<admon type="warn">

The `dvc remote modify --local` flag is needed to write sensitive user info to a
Git-ignored config file (`.dvc/config.local`) so that no secrets are leaked
through Git. See `dvc config`.

</admon>

Alternatively, the `GOOGLE_APPLICATION_CREDENTIALS` environment variable can be
set:

```cli
$ export GOOGLE_APPLICATION_CREDENTIALS='.../project-XXX.json'
```

## More configuration parameters

<admon type="info">

See `dvc remote modify` for more command usage details.

</admon>

- `url` - modify the remote location ([scroll up](#google-cloud-storage) for
  details)

- `projectname` - override or provide a project name to use if a default one is
  not set.
