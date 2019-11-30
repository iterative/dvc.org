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
