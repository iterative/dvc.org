# HDFS

> The Hadoop Distributed File System is a distributed file system designed to
> run on commodity hardware. HDFS is highly fault-tolerant and is designed to be
> deployed on low-cost hardware. HDFS provides high throughput access to
> application data and is suitable for applications that have large data sets.
> HDFS relaxes a few POSIX requirements to enable streaming access to file
> system data.
>
> Note that as long as there is a `hdfs://...` path for your data, DVC can
> handle it. So systems like Hadoop, Hive, and HBase are supported!

We can create an HDFS remote with `dvc remote add`:

```dvc
$ dvc remote add myremote hdfs://user@example.com/path/to/dir
```

> **Note!** If you are seeing `Unable to load libjvm` error on ubuntu with
> openjdk-8, try setting JAVA_HOME env variable. This issue is solved in the
> [upstream version of pyarrow](https://github.com/apache/arrow/pull/4907) and
> the fix will be included into the next pyarrow release.

The configuration file `.dvc/config` should have a content like this:

```ini
['remote "myremote"']
url = hdfs://user@example.com/path/to/dir
```

<details>

### Details: HDFS available options

- `user` - username to use to access a remote.

  ```dvc
  $ dvc remote modify myremote user myuser
  ```

</details>
