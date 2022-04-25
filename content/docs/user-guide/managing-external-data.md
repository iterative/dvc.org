# Managing External Data

> ⚠️ This is an advanced feature for very specific situations and not
> recommended except if there's absolutely no other alternative. In most cases,
> alternatives like the [to-cache] or [to-remote] strategies of `dvc add` and
> `dvc import-url` are more convenient. **Note** that external outputs are not
> pushed or pulled from/to [remote storage].

[to-cache]: /doc/command-reference/add#example-transfer-to-an-external-cache
[to-remote]: /doc/command-reference/add#example-transfer-to-remote-storage
[remote storage]: /doc/command-reference/remote

There are cases when data is so large, or its processing is organized in such a
way, that its impossible to handle it in the local machine disk. For example
versioning existing data on a network attached storage (NAS), processing data on
HDFS, running [Dask](https://dask.org/) via SSH, or any code that generates
massive files directly to the cloud.

_External outputs_ (and
[external dependencies](/doc/user-guide/external-dependencies)) provide ways to
track and version data outside of the <abbr>project</abbr>.

## How external outputs work

External <abbr>outputs</abbr> will be tracked by DVC for
[versioning](/doc/use-cases/versioning-data-and-model-files), detecting when
they change (reported by `dvc status`, for example).

To use existing files or directories in an external location as outputs, give
their remote URLs or external paths to `dvc add`, or put them in `dvc.yaml`
(`deps` field). Use the same format as the `url` of the following supported
`dvc remote` types/protocols:

- Amazon S3
- SSH
- HDFS
- Local files and directories outside the workspace

> Avoid using the same DVC remote used for `dvc push`, `dvc pull`, etc. as
> external cache, because it may cause data collisions: the hash of an external
> output could collide with that of a local file with different content.

> Note that [remote storage] is a different feature.

## Setting up an external cache

DVC requires that the project's <abbr>cache</abbr> is configured in the same
external location as the data that will be tracked (external outputs). This
avoids transferring files to the local environment and enables [file links]
within the external storage.

[file links]:
  /doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache

As an example, let's create a directory external to the workspace and set it up
as cache:

```dvc
$ mkdir -p /home/shared/dvcstore
$ dvc cache dir /home/shared/dvcstore
```

> See `dvc cache dir` and `dvc config cache` for more information.

💡 Note that in real-life scenarios, often the directory will be in a remote
location, e.g. `s3://mybucket/cache` or `ssh://user@example.com/cache` (see the
examples below).

> ⚠️ An external cache could be
> [shared](/doc/user-guide/how-to/share-a-dvc-cache) among copies of a DVC
> project. Please **do not** use external outputs in that scenario, as
> `dvc checkout` in any project would overwrite the working data for all
> projects.

## Examples

Let's take a look at the following operations on all the supported location
types:

1. Configure an external <abbr>cache</abbr> directory (added as a
   `dvc remote`\*) in the same location as the external data, using
   `dvc config`.
2. Tracking existing data on the external location using `dvc add` (`--external`
   option needed). This produces a `.dvc` file with an external URL or path in
   its `outs` field.
3. Creating a simple stage with `dvc run` (`--external` option needed) that
   moves a local file to the external location. This produces an external output
   in `dvc.yaml`.

> \* Note that for certain remote storage authentication methods, extra config
> steps are required (see `dvc remote modify` for details). Once access is
> setup, use the special `remote://` URL format in step 2. For example:  
> `dvc add --external remote://myxcache/existing-data`.

<details>

### Amazon S3

```dvc
$ dvc remote add s3cache s3://mybucket/cache
$ dvc config cache.s3 s3cache

$ dvc add --external s3://mybucket/existing-data

$ dvc run -d data.txt \
          --external \
          -o s3://mybucket/data.txt \
          aws s3 cp data.txt s3://mybucket/data.txt
```

</details>

<details>

### SSH

```dvc
$ dvc remote add sshcache ssh://user@example.com/cache
$ dvc config cache.ssh sshcache

$ dvc add --external ssh://user@example.com/existing-data

$ dvc run -d data.txt \
          --external \
          -o ssh://user@example.com/data.txt \
          scp data.txt user@example.com:/data.txt
```

⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
Please check that you are able to connect both ways with tools like `ssh` and
`sftp` (GNU/Linux).

> Note that your server's SFTP root might differ from its physical root (`/`).

</details>

<details>

### HDFS

```dvc
$ dvc remote add hdfscache hdfs://user@example.com/cache
$ dvc config cache.hdfs hdfscache

$ dvc add --external hdfs://user@example.com/existing-data

$ dvc run -d data.txt \
          --external \
          -o hdfs://user@example.com/data.txt \
          hdfs fs -copyFromLocal \
                  data.txt \
                  hdfs://user@example.com/data.txt
```

Note that as long as there is a `hdfs://...` URL for your data, DVC can handle
it. So systems like Hadoop, Hive, and HBase are supported!

</details>

<details>

### WebHDFS

```dvc
$ dvc remote add webhdfscache webhdfs://user@example.com/cache
$ dvc config cache.webhdfs webhdfscache

$ dvc add --external webhdfs://user@example.com/existing-data

$ dvc run -d data.txt \
          --external \
          -o webhdfs://user@example.com/data.txt \
          curl --upload-file data.txt \
              "http://user@example.com:50075/webhdfs/v1/data.txt?op=CREATE"
```

</details>

<details>

### local file system paths

The default <abbr>cache</abbr> is in `.dvc/cache`, so there is no need to set a
custom cache location for local paths outside of your project.

> Except for external data on different storage devices or partitions mounted on
> the same file system (e.g. `/mnt/raid/data`). In that case please setup an
> external cache in that same drive to enable [file links] and avoid copying
> data.

```dvc
$ dvc add --external /home/shared/existing-data

$ dvc run -d data.txt \
          --external \
          -o /home/shared/data.txt \
          cp data.txt /home/shared/data.txt
```

</details>
