# External Data on Google Cloud Storage

Google Cloud Storage is a RESTful online file storage web service for storing
and accessing data on Google Cloud Platform infrastructure.

## Remotes

We can create a GS remote with `dvc remote add` like this:

```dvc
$ dvc remote add myremote gs://bucket/path
```

The configuration file `.dvc/config` should have a content like this:

```ini
['remote "myremote"']
url = gs://bucket/path
```

<details>

### Use GS as a DVC Storage

To use GS as a DVC storage we should create a _default_ remote with the option
`-d, --default`, like this:

```dvc
$ dvc remote add --default myremote gs://bucket/path
Setting 'myremote' as a default remote.
```

The configuration file `.dvc/config` should have a content like this:

```ini
['remote "myremote"']
url = gs://bucket/path
[core]
remote = myremote
```

</details>

<details>

### Details: GS available options

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

</details>

## External Dependencies

Let's take as an example a stage that simply downloads a file from a GS
location:

```dvc
$ dvc run \
      -d gs://mybucket/file.csv \
      -o file.csv \
      'gsutil cp gs://mybucket/file.csv file.csv'
```

It is even easier to download a file if we use the command `dvc import-url`:

```dvc
$ dvc import-url gs://mybucket/file.csv
```

Or, using a remote:

```dvc
$ dvc remote add gs-data gs://mybucket
$ dvc import-url remote://gs-data/file.csv
```

## External Data and Outputs

For cached external outputs (specified using `-o`) we need to setup an external
cache location that will be used by DVC to store versions of the external file:

```dvc
# Add GS remote to be used as cache location for GS files
$ dvc remote add gscache gs://mybucket/cache

# Tell dvc to use the 'gscache' remote as GS cache location
$ dvc config cache.gs gscache
```

> Non-cached external outputs (specified using `-O`) do not require an external
> cache to be setup.

<details>

### Warning: Don't use the same location for the external cache and for the DVC storage

When you setup an external cache for your external outputs, avoid using the same
location that you are using for the DVC storage (which is accessed by
`dvc push`, `dvc pull`, `dvc fetch`), because it may cause possible checksum
overlaps. Checksum for some data file on an external storage can potentially
collide with checksum generated locally for a different file, with a different
content.

```dvc
# Add a DVC storage
$ dvc remote add --default storage gs://mybucket/dvc-storage
```

</details>

Now we can track remote data or create a stage with remote output. Let's take as
example a stage that simply copies a local file to a GS location:

```dvc
# Track data that is located on GS
$ dvc add gs://mybucket/data/file.csv

# Create a stage with a GS external output
$ dvc run \
      -d model.pkl \
      -o gs://mybucket/data/model.pkl \
      'gsutil cp model.pkl gs://mybucket/data/model.pkl'
```
