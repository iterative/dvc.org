# Managing External Data

There are cases when data is large enough or processing is organized in a way
that you would like to avoid moving data out of the remote storage. For example,
you are processing data on HDFS, run Dask via SSH, or have a script that streams
data from S3 to process it, etc. A mechanism of external outputs and
[External Dependencies](/doc/user-guide/external-dependencies) provides a way to
for DVC to control data externally.

## Description

You can take under DVC control files on an external storage with `dvc add` or
specify external files as outputs for
[DVC-files](/doc/user-guide/dvc-file-format) created by `dvc run` (stage files)
DVC will track changes in those files and will reflect so in your pipeline
[status](/doc/commands-reference/status). Currently, the following types of
external outputs (protocols) are supported:

1. Local files and directories outside of your dvc repository;
2. Amazon S3;
3. Google Cloud Storage;
4. SSH;
5. HDFS;

> Note that these are a subset of the remote storage types supported by
> `dvc remote`.

In order to specify an external output for a stage file use the usual `-o` and
`-O` options with the `dvc run` command, but with the external path or URL
pointing to your desired files. For cached external outputs (specified using
`-o`) you will need to setup an
[external cache](/doc/commands-reference/config#cache) location that will be
used by DVC to store versions of your external file. Non-cached external outputs
(specified using `-O`) do not require external cache to be setup.

> Avoid using the same remote location that you are using for `dvc push`,
> `dvc pull`, `dvc fetch` as external cache for your external outputs, because
> it may cause possible checksum overlaps. Checksum for some data file on an
> external storage can potentially collide with checksum generated locally for a
> different file, with a different content.

## Examples

For the examples, let's take a look at a [stage](/doc/commands-reference/run)
that simply moves local file to an external location, producing a `data.txt.dvc`
stage file (DVC-file).

> Note that some of these commands use the `/home/shared/` directory, typical in
> Linux distributions.

### Local

Your local cache location already defaults to `.dvc/cache`, so there is no need
to specify it explicitly.

```dvc
$ dvc add /home/shared/mydata
$ dvc run -d data.txt \
          -o /home/shared/data.txt \
          cp data.txt /home/shared/data.txt
```

### Amazon S3

```dvc
# Add S3 remote to be uses as cache location for S3 files
$ dvc remote add s3cache s3://mybucket/cache

# Tell dvc to use the 's3cache' remote as S3 cache location
$ dvc config cache.s3 s3cache

# Add data on S3 directly
$ dvc add s3://mybucket/mydata

# Run the stage with external S3 output
$ dvc run -d data.txt \
          -o s3://mybucket/data.txt \
          aws s3 cp data.txt s3://mybucket/data.txt
```

### Google Cloud Storage

```dvc
# Add GS remote to be used as cache location for GS files
$ dvc remote add gscache gs://mybucket/cache

# Tell dvc to use the 'gscache' remote as GS cache location
$ dvc config cache.gs gscache

# Add data on GS directly
$ dvc add gs://mybucket/mydata

# Run the stage with external GS output
$ dvc run -d data.txt \
          -o gs://mybucket/data.txt \
          gsutil cp data.txt gs://mybucket/data.txt
```

### SSH

```dvc
# Add SSH remote to be used as cache location for SSH files
$ dvc remote add sshcache ssh://user@example.com:/cache

# Tell dvc to use the 'sshcache' remote as SSH cache location
$ dvc config cache.ssh sshcache

# Add data on SSH directly
$ dvc add ssh://user@example.com:/mydata

# Run the stage with external SSH output
$ dvc run -d data.txt \
          -o ssh://user@example.com:/home/shared/data.txt \
          scp data.txt user@example.com:/home/shared/data.txt
```

### HDFS

```dvc
# Add HDFS remote to be used as cache location for HDFS files
$ dvc remote add hdfscache hdfs://user@example.com/cache

# Tell dvc to use the 'hdfscache' remote as HDFS cache location
$ dvc config cache.hdfs hdfscache

# Add data on HDFS directly
$ dvc add hdfs://user@example.com/mydata

# Run the stage with external HDFS output
$ dvc run -d data.txt \
          -o hdfs://user@example.com/home/shared/data.txt \
          hdfs fs -copyFromLocal \
                            data.txt \
                            hdfs://user@example.com/home/shared/data.txt
```

Note that as long as there is a `hdfs://...` path for your data, DVC can handle
it. So systems like Hadoop, Hive, and HBase are supported!
