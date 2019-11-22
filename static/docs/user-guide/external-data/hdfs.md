# External Data on HDFS

The Hadoop Distributed File System is a distributed file system designed to run
on commodity hardware. HDFS is highly fault-tolerant and is designed to be
deployed on low-cost hardware. HDFS provides high throughput access to
application data and is suitable for applications that have large data sets.
HDFS relaxes a few POSIX requirements to enable streaming access to file system
data.

Note that as long as there is a `hdfs://...` path for your data, DVC can handle
it. So systems like Hadoop, Hive, and HBase are supported!

## Create Remotes

We can create an HDFS remote like this:

```dvc
$ dvc remote add myremote hdfs://user@example.com/path/to/dir

$ dvc remote list
myremote	hdfs://user@example.com/path/to/dir

$ cat .dvc/config
['remote "myremote"']
url = hdfs://user@example.com/path/to/dir
```

> **Note!** If you are seeing `Unable to load libjvm` error on ubuntu with
> openjdk-8, try setting JAVA_HOME env variable. This issue is solved in the
> [upstream version of pyarrow](https://github.com/apache/arrow/pull/4907) and
> the fix will be included into the next pyarrow release.

<details>

### Details: HDFS available options

- `user` - username to use to access a remote.

  ```dvc
  $ dvc remote modify myremote user myuser
  ```

</details>

## DVC Storage

To use HDFS as a DVC storage we should create a default remote:

```dvc
$ dvc remote add --default \
      storage hdfs://user@example.com/path/to/dir

$ dvc remote list
storage	hdfs://user@example.com/path/to/dir

$ cat .dvc/config
['remote "storage"']
url = hdfs://user@example.com/path/to/dir
[core]
remote = storage
```

## External Dependencies

Let's take as an example a stage that simply downloads a file from an HDFS
location:

```dvc
$ dvc run \
      -d hdfs://user@example.com/srv/data/file.csv \
      -o file.csv \
      'hdfs fs -copyToLocal \
          hdfs://user@example.com/srv/data/file.csv \
          file.csv'
```

It is even easier to download a file if we use the command `dvc import-url`:

```dvc
$ dvc import-url hdfs://user@example.com/srv/data/file.csv
```

Or, using a remote:

```dvc
$ dvc remote add hdfs-data hdfs://user@example.com/srv/data
$ dvc import-url remote://hdfs-data/file.csv
```

## External Data and Outputs

For cached external outputs (specified using `-o`) we need to setup an external
cache location that will be used by DVC to store versions of the external file.
Non-cached external outputs (specified using `-O`) do not require an external
cache to be setup.

> When you setup an external cache for your external outputs, avoid using the
> same location that you are using for the DVC storage (which is accessed by
> `dvc push`, `dvc pull`, `dvc fetch`), because it may cause possible checksum
> overlaps. Checksum for some data file on an external storage can potentially
> collide with checksum generated locally for a different file, with a different
> content.

Let's take as example a stage that simply copies a local file to an HDFS
location.

```dvc
# Add a DVC storage
$ dvc remote add --default \
      storage hdfs://user@example.com/dvc-storage

# Add HDFS remote to be used as cache location for HDFS files
$ dvc remote add hdfscache hdfs://user@example.com/cache

# Tell dvc to use the 'hdfscache' remote as HDFS cache location
$ dvc config cache.hdfs hdfscache

# Track data that is located on HDFS
$ dvc add hdfs://user@example.com/data/file.csv

# Create a stage with an HDFS external output
$ dvc run \
      -d model.pkl \
      -o hdfs://user@example.com/data/model.pkl \
      'hdfs fs -copyFromLocal \
          model.pkl \
          hdfs://user@example.com/data/model.pkl
```
