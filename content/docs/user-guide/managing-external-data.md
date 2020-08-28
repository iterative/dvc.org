# Managing External Data

There are cases when data is so large, or its processing is organized in a way
that you would like to avoid moving it out of its external/remote location. For
example from a network attached storage (NAS) drive, processing data on HDFS,
running [Dask](https://dask.org/) via SSH, or having a script that streams data
from S3 to process it. External outputs and
[external dependencies](/doc/user-guide/external-dependencies) provide a way for
DVC to track data outside of the <abbr>project</abbr>.

## Description

DVC can track files on an external location with `dvc add` or specify external
files or directories as <abbr>outputs</abbr> for `dvc.yaml` files. External
outputs are considered part of the (extended) DVC project: DVC will track
changes in them, and reflect this in `dvc status` for example.

Currently, the following types (protocols) of external outputs (and
<abbr>cache</abbr>) are supported:

- Local files and directories outside the <abbr>workspace</abbr>
- SSH
- Amazon S3
- Google Cloud Storage
- HDFS

> Note that these are a subset of the remote storage types supported by
> `dvc remote`.

In order to specify an external output for a stage file, add them to the stage
in `dvc.yaml` normally (for example with the usual `-o` or `-O` options of
`dvc run`) but with the external path or URL to the file in question. For cached
external outputs (`-o`), you will need to
[setup an external cache](/doc/use-cases/shared-development-server#configure-the-external-shared-cache)
in the same external/remote file system first.

Please note that there is no support for external metrics or plots (`-m`, `-p`,
etc. options of `dvc run`).

> Avoid using the same [DVC remote](/doc/command-reference/remote) (used for
> `dvc push`, `dvc pull`, etc.) for external outputs, because it may cause file
> hash overlaps: the hash of an external output could collide with a hash
> generated locally for another file with different content.

## Examples

For the examples, let's take a look at a [stage](/doc/command-reference/run)
that simply moves local file to an external location, producing a `data.txt.dvc`
DVC-file.

### Amazon S3

```dvc
# Add S3 remote to be used as cache location for S3 files
$ dvc remote add s3cache s3://mybucket/cache

# Tell DVC to use the 's3cache' remote as S3 cache location
$ dvc config cache.s3 s3cache

# Add data on S3 directly
$ dvc add --external s3://mybucket/mydata

# Create the stage with an external S3 output
$ dvc run -d data.txt \
          --external \
          -o s3://mybucket/data.txt \
          aws s3 cp data.txt s3://mybucket/data.txt
```

### Google Cloud Storage

```dvc
# Add GS remote to be used as cache location for GS files
$ dvc remote add gscache gs://mybucket/cache

# Tell DVC to use the 'gscache' remote as GS cache location
$ dvc config cache.gs gscache

# Add data on GS directly
$ dvc add --external gs://mybucket/mydata

# Create the stage with an external GS output
$ dvc run -d data.txt \
          --external \
          -o gs://mybucket/data.txt \
          gsutil cp data.txt gs://mybucket/data.txt
```

### SSH

```dvc
# Add SSH remote to be used as cache location for SSH files
$ dvc remote add sshcache ssh://user@example.com/cache

# Tell DVC to use the 'sshcache' remote as SSH cache location
$ dvc config cache.ssh sshcache

# Add data on SSH directly
$ dvc add --external ssh://user@example.com/mydata

# Create the stage with an external SSH output
$ dvc run -d data.txt \
          --external \
          -o ssh://user@example.com/data.txt \
          scp data.txt user@example.com:/data.txt
```

> Please note that to use password authentication, it's necessary to set the
> `password` or `ask_password` SSH remote options first (see
> `dvc remote modify`), and use the special URL in:
> `dvc add --external remote://sshcache/mydata`.

⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
Please check that you are able to connect both ways with tools like `ssh` and
`sftp` (GNU/Linux).

> Note that your server's SFTP root might differ from its physical root (`/`).

### HDFS

```dvc
# Add HDFS remote to be used as cache location for HDFS files
$ dvc remote add hdfscache hdfs://user@example.com/cache

# Tell DVC to use the 'hdfscache' remote as HDFS cache location
$ dvc config cache.hdfs hdfscache

# Add data on HDFS directly
$ dvc add --external hdfs://user@example.com/mydata

# Create the stage with an external HDFS output
$ dvc run -d data.txt \
          --external \
          -o hdfs://user@example.com/data.txt \
          hdfs fs -copyFromLocal \
                  data.txt \
                  hdfs://user@example.com/data.txt
```

Note that as long as there is a `hdfs://...` URL for your data, DVC can handle
it. So systems like Hadoop, Hive, and HBase are supported!

### Local file system path

The default cache location is `.dvc/cache`, so there is no need to move it for
local paths outside of your project.

> Except for external data on different storage devices or partitions mounted on
> the same file system (e.g. `/mnt/raid/data`). In that case please setup an
> external cache in that same drive to enable
> [file links](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> and avoid copying data.

```dvc
# Add data on an external location directly
$ dvc add --external /home/shared/mydata

# Create the stage with an external location output
$ dvc run -d data.txt \
          --external \
          -o /home/shared/data.txt \
          cp data.txt /home/shared/data.txt
```
