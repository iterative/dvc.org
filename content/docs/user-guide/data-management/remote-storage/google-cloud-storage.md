# Google Cloud Storage

<!--
## Google Cloud Storage
-->

`dvc remote add` a (new) remote name and a valid [Google Cloud Storage] URL:

```cli
$ dvc remote add -d myremote gs://<mybucket>/<path>
```

<admon type="tip">

The `-d` flag (optional) makes this the `--default` remote for the
<abbr>project</abbr>.

</admon>

- `<mybucket>` - name of an [existing storage bucket]
- `<path>` - optional path to a [folder] in your bucket

[google cloud storage]: https://cloud.google.com/storage
[existing storage bucket]:
  https://cloud.google.com/storage/docs/creating-buckets
[folder]: https://cloud.google.com/storage/docs/folders

## Authentication

By default, DVC reuses [gcloud CLI authorization] for auth (reads the default
GCP key file).

[gcloud cli authorization]: https://cloud.google.com/sdk/docs/authorizing

<admon type="warn">

Make sure to run [gcloud auth application-default login] unless you use a
service account or other ways to authenticate ([more info]).

[gcloud auth application-default login]:
  https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login
[more info]: https://stackoverflow.com/a/53307505/298182

</admon>

For custom authentication, you can set the following configuration parameters
with `dvc remote modify --local`.

<admon type="warn">

The `--local` flag is needed to write sensitive user info to a Git-ignored
config file (`.dvc/config.local`) so that no secrets are leaked through Git. See
`dvc config`.

</admon>

WIP

<!--

### Google Cloud Storage

- `projectname` - override or provide a project name to use, if a default one is
  not set.

  ```cli
  $ dvc remote modify myremote projectname myproject
  ```

**For service accounts:**

A service account is a Google account associated with your GCP project, and not
a specific user. Please refer to
[Using service accounts](https://cloud.google.com/iam/docs/service-accounts) for
more information.

- `credentialpath` - path to the file that contains the
  [service account key](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account).
  Make sure that the service account has read/write access (as needed) to the
  file structure in the remote `url`.

  ```cli
  $ dvc remote modify --local myremote \
          credentialpath '/home/.../project-XXX.json'
  ```

Alternatively, the `GOOGLE_APPLICATION_CREDENTIALS` environment variable can be
set:

```cli
$ export GOOGLE_APPLICATION_CREDENTIALS='.../project-XXX.json'
```

-->

## Cloud versioning

Learn about DVC [cloud versioning] support.

<admon type="info">

Requires [Object versioning] enabled on the bucket.

</admon>

[cloud versioning]: /docs/user-guide/data-management/cloud-versioning
[object versioning]: https://cloud.google.com/storage/docs/object-versioning

- `version_aware` (`true` or `false`) - use [version-aware] cloud versioning
  features for this remote.

  ```cli
  $ dvc remote modify myremote version_aware true
  ```

- `worktree` (`true` or `false`) - use [worktree] cloud versioning features for
  this remote (implies `version_aware`).

  ```cli
  $ dvc remote modify myremote worktree true
  ```

[version-aware]:
  /docs/user-guide/data-management/cloud-versioning#version-aware-remotes
[worktree]: /docs/user-guide/data-management/cloud-versioning#worktree-remotes

## More configuration options

<admon type="info">

See `dvc remote modify` for more command usage details.

</admon>

- `url` - used to modify the remote location ([scroll up](#google-cloud-storage)
  for details)
