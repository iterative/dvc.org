# External Data on HDFS

As long as there is a `hdfs://...` path for your data, DVC can handle it.
Systems like Hadoop, Hive, and HBase are supported.

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
cache location that will be used by DVC to store versions of the external file:

```dvc
# Add HDFS remote to be used as cache location for HDFS files
$ dvc remote add hdfscache hdfs://user@example.com/cache

# Tell dvc to use the 'hdfscache' remote as HDFS cache location
$ dvc config cache.hdfs hdfscache
```

> Non-cached external outputs (specified using `-O`) do not require an external
> cache to be setup.

Now we can track remote data or create a stage with remote output. Let's take as
example a stage that simply copies a local file to an HDFS location:

```dvc
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
