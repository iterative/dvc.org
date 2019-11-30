# Google Cloud Storage

We can create a GS remote with `dvc remote add` like this:

```dvc
$ dvc remote add myremote gs://bucket/path
```

The configuration file `.dvc/config` should have a content like this:

```ini
['remote "myremote"']
url = gs://bucket/path
```

### GS available options

- `projectname` - project name to use.

  ```dvc
  $ dvc remote modify myremote projectname myproject
  ```

- `url` - remote location URL.

  ```dvc
  $ dvc remote modify myremote url gs://bucket/remote
  ```

- `credentialpath` -
  [service account credentials](https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually).

  ```dvc
  $ dvc remote modify myremote \
        credentialpath /path/to/my/creds/[FILE_NAME].json
  ```
