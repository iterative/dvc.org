# Managing External Data

There are cases when data is so large, or its processing is organized in a way
that you would like to avoid moving it out of its external/remote location. For
example from a network attached storage (NAS) drive, processing data on HDFS,
running [Dask](https://dask.org/) via SSH, or having a script that streams data
from S3 to process it. External outputs and
[external dependencies](/doc/user-guide/external-dependencies) provide a way for
DVC to control data outside of the <abbr>project</abbr> directory.

## Description

DVC can track files on an external storage with `dvc add` or specify external
files as <abbr>outputs</abbr> for
[DVC-files](/doc/user-guide/dvc-files-and-directories) created by `dvc run`
(stage files). External outputs are considered part of the DVC project. DVC will
track changes in them and reflect this in the output of `dvc status`.

Currently, the following types (protocols) of external outputs (and
<abbr>cache</abbr>) are supported:

- Local files and directories outside of your <abbr>workspace</abbr>
- SSH
- Amazon S3
- Google Cloud Storage
- HDFS

> Note that these are a subset of the remote storage types supported by
> `dvc remote`.

In order to specify an external output for a stage file, use the usual `-o` or
`-O` options of `dvc run`, but with the external path or URL to the file in
question. For <abbr>cached</abbr> external outputs (`-o`) you will need to
[setup an external cache](/doc/use-cases/shared-development-server#configure-the-external-shared-cache)
in the same external/remote file system first.

> Avoid using the same location of the
> [remote storage](/doc/command-reference/remote) that you have for `dvc push`
> and `dvc pull` for external outputs or as external cache, because it may cause
> file hash overlaps: The hash value of a data file in external storage could
> collide with the one generated locally for another file.

## Examples

For the examples, let's take a look at a [stage](/doc/command-reference/run)
that simply moves local file to an external location, producing a `data.dvc`
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
$ dvc run -d data \
          --external \
          -o s3://mybucket/data \
          aws s3 cp data s3://mybucket/data
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
$ dvc run -d data \
          --external \
          -o gs://mybucket/data \
          gsutil cp data gs://mybucket/data
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
$ dvc run -d data \
          --external \
          -o ssh://user@example.com/data \
          scp data user@example.com:/data
```

⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
Please check that you are able to connect both ways with tools like `ssh` and
`sftp` (GNU/Linux).

> Note that your server's SFTP root might differ from its physical root (`/`).

### HDFS

```dvc
# Add HDFS remote to be used as cache location for HDFS files
$ dvc remote add hdfscache \
                 hdfs://user@example.com/cache

# Tell DVC to use the 'hdfscache' remote as HDFS cache location
$ dvc config cache.hdfs hdfscache

# Add data on HDFS directly
$ dvc add --external hdfs://user@example.com/mydata

# Create the stage with an external HDFS output
$ dvc run -d data \
          --external \
          -o hdfs://user@example.com/data \
          hdfs fs -copyFromLocal \
                  data \
                  hdfs://user@example.com/data
```

Note that as long as there is a `hdfs://...` URL for your data, DVC can handle
it. So systems like Hadoop, Hive, and HBase are supported!

### Local file system path

The default local cache location is `.dvc/cache`, so there is no need to specify
it explicitly.

```dvc
# Add data on an external location directly
$ dvc add --external /home/shared/mydata

# Create the stage with an external location output
$ dvc run -d data \
          --external \
          -o /home/shared/data \
          cp data /home/shared/data
```
