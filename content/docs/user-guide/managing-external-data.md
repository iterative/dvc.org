# Managing External Data

There are cases when data is so large, or its processing is organized in a way
such that its preferable to avoid moving it from its external/remote location.
For example data on a network attached storage (NAS), processing data on HDFS,
running [Dask](https://dask.org/) via SSH, or having a script that streams data
from S3 to process it.

External <abbr>outputs</abbr> and
[external dependencies](/doc/user-guide/external-dependencies) provide ways to
track data outside of the <abbr>project</abbr>.

## How external outputs work

DVC can track existing files or directories on an external location with
`dvc add` (`out` field). It can also create external files or directories as
outputs for `dvc.yaml` files (only `outs` field, not metrics or plots).

External outputs are considered part of the (extended) DVC project: DVC will
track changes in them, and reflect this in `dvc status` reports, for example.

Normally, external outputs (e.g. `dvc add`, `dvc run -o`), require an
[external cache](/doc/use-cases/shared-development-server#configure-the-external-shared-cache)
in the same external/remote file.

Currently, the following types (protocols) of external outputs (and cache) are
supported:

- Amazon S3
- Microsoft Azure Blob Storage
- Google Cloud Storage
- SSH
- HDFS
- Local files and directories outside the <abbr>workspace</abbr>

💡 Note that external outputs are never pushed or pulled from/to
[remote storage](/doc/command-reference/remote).

> ⚠️ Avoid using the same DVC remote (used for `dvc push`, `dvc pull`, etc.) for
> external outputs, because it may cause file hash overlaps: the hash of an
> external output could collide with a hash generated locally for another file
> with different content.

## Examples

Let's take a look at:

1. Adding a `dvc remote` to use as cache for data in the external location, and
   configure it as external <abbr>cache</abbr> with `dvc config`.
2. Tracking existing data on an external location with `dvc add` (this doesn't
   download it). This produces a `.dvc` file with an external output.
3. Creating a simple [stage](/doc/command-reference/run) that moves a local file
   to the external location. This produces a stage with another external output
   in `dvc.yaml`.

<details>

### Click for Amazon S3

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

### Click for Microsoft Azure Blob Storage

```dvc
$ dvc remote add azurecache azure://mycontainer/cache
$ dvc config cache.azure azurecache

$ dvc add --external azure://mycontainer/existing-data

$ dvc run -d data.txt \
          --external \
          -o azure://mycontainer/data.txt \
          az storage blob upload -f data.txt -c mycontainer -n data.txt
```

</details>

<details>

### Click for Google Cloud Storage

```dvc
$ dvc remote add gscache gs://mybucket/cache
$ dvc config cache.gs gscache

$ dvc add --external gs://mybucket/existing-data

$ dvc run -d data.txt \
          --external \
          -o gs://mybucket/data.txt \
          gsutil cp data.txt gs://mybucket/data.txt
```

</details>

<details>

### Click for SSH

```dvc
$ dvc remote add sshcache ssh://user@example.com/cache
$ dvc config cache.ssh sshcache

$ dvc add --external ssh://user@example.com/existing-data

$ dvc run -d data.txt \
          --external \
          -o ssh://user@example.com/data.txt \
          scp data.txt user@example.com:/data.txt
```

> Please note that to use password authentication, it's necessary to set the
> `password` or `ask_password` SSH remote options first (see
> `dvc remote modify`), and use a special `remote://` URL in step 2:
> `dvc add --external remote://sshcache/existing-data`.

⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
Please check that you are able to connect both ways with tools like `ssh` and
`sftp` (GNU/Linux).

> Note that your server's SFTP root might differ from its physical root (`/`).

</details>

<details>

### Click for HDFS

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

### Click for local file system paths

The default <abbr>cache</abbr> is in `.dvc/cache`, so there is no need to set a
custom cache location for local paths outside of your project.

> Except for external data on different storage devices or partitions mounted on
> the same file system (e.g. `/mnt/raid/data`). In that case please setup an
> external cache in that same drive to enable
> [file links](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> and avoid copying data.

```dvc
$ dvc add --external /home/shared/existing-data

$ dvc run -d data.txt \
          --external \
          -o /home/shared/data.txt \
          cp data.txt /home/shared/data.txt
```

</details>
