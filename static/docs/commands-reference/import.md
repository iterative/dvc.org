# import

Import file from URL to local directory and track changes in remote file.

Supported schemes:

* `LOCAL` - Local path
* `S3` - URL to a file on Amazon S3
* `GS` - URL to a file on Google Storage
* `SSH` - URL to a file on another machine with SSH access
* `HDFS` - URL to a file on HDFS

```sh
    usage: dvc import [-h] [-q] [-v] url out
    
    positional arguments:
      url            URL
      out            Output
    
    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.

```

## Examples

```sh
    $ dvc import /path/to/data.csv local_data.csv
    $ dvc import s3://mybucket/data.csv s3_data.csv
    $ dvc import gs://mybucket/data.csv gs_data.csv
    $ dvc import ssh://user@example.com:/path/to/data.csv ssh_data.csv
    $ dvc import hdfs://user@example.com/path/to/data.csv hdfs_data.csv
```
